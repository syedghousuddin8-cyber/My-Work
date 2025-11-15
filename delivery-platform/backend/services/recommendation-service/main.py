from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import redis
import psycopg2
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from typing import List, Dict
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Recommendation Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Redis connection
redis_client = redis.Redis(
    host=os.getenv('REDIS_HOST', 'localhost'),
    port=int(os.getenv('REDIS_PORT', 6379)),
    decode_responses=True
)

# PostgreSQL connection
def get_db_connection():
    return psycopg2.connect(
        host=os.getenv('POSTGRES_HOST', 'localhost'),
        port=os.getenv('POSTGRES_PORT', 5432),
        database=os.getenv('POSTGRES_DB', 'delivery_platform'),
        user=os.getenv('POSTGRES_USER', 'postgres'),
        password=os.getenv('POSTGRES_PASSWORD', 'postgres')
    )

class RecommendationEngine:
    def __init__(self):
        self.user_item_matrix = None
        self.vendor_features = None

    def get_user_order_history(self, user_id: str) -> List[Dict]:
        """Get user's past orders"""
        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute("""
            SELECT v.id, v.business_name, v.primary_category, v.cuisines,
                   COUNT(*) as order_count,
                   AVG(o.customer_rating) as avg_rating
            FROM orders o
            JOIN vendors v ON o.vendor_id = v.id
            WHERE o.customer_id = %s AND o.status = 'delivered'
            GROUP BY v.id, v.business_name, v.primary_category, v.cuisines
            ORDER BY order_count DESC
        """, (user_id,))

        results = cur.fetchall()
        cur.close()
        conn.close()

        return [
            {
                'vendor_id': r[0],
                'name': r[1],
                'category': r[2],
                'cuisines': r[3],
                'order_count': r[4],
                'avg_rating': float(r[5]) if r[5] else 0
            }
            for r in results
        ]

    def get_collaborative_recommendations(self, user_id: str, limit: int = 10) -> List[str]:
        """Collaborative filtering recommendations"""
        # Check cache
        cache_key = f"recommendations:user:{user_id}"
        cached = redis_client.get(cache_key)
        if cached:
            return eval(cached)[:limit]

        conn = get_db_connection()
        cur = conn.cursor()

        # Find similar users based on order history
        cur.execute("""
            WITH user_vendors AS (
                SELECT customer_id, vendor_id, COUNT(*) as order_count
                FROM orders
                WHERE status = 'delivered'
                GROUP BY customer_id, vendor_id
            ),
            current_user_vendors AS (
                SELECT vendor_id
                FROM user_vendors
                WHERE customer_id = %s
            ),
            similar_users AS (
                SELECT uv.customer_id, COUNT(DISTINCT uv.vendor_id) as common_vendors
                FROM user_vendors uv
                INNER JOIN current_user_vendors cuv ON uv.vendor_id = cuv.vendor_id
                WHERE uv.customer_id != %s
                GROUP BY uv.customer_id
                HAVING COUNT(DISTINCT uv.vendor_id) >= 2
                ORDER BY common_vendors DESC
                LIMIT 50
            )
            SELECT v.id, v.business_name, COUNT(*) as recommendation_score
            FROM orders o
            JOIN vendors v ON o.vendor_id = v.id
            JOIN similar_users su ON o.customer_id = su.customer_id
            WHERE v.id NOT IN (SELECT vendor_id FROM current_user_vendors)
              AND v.is_active = true
              AND v.is_online = true
            GROUP BY v.id, v.business_name
            ORDER BY recommendation_score DESC, v.average_rating DESC
            LIMIT %s
        """, (user_id, user_id, limit))

        results = [row[0] for row in cur.fetchall()]
        cur.close()
        conn.close()

        # Cache for 1 hour
        redis_client.setex(cache_key, 3600, str(results))

        return results

    def get_content_based_recommendations(self, user_id: str, limit: int = 10) -> List[str]:
        """Content-based recommendations based on user preferences"""
        user_history = self.get_user_order_history(user_id)

        if not user_history:
            return self.get_trending_vendors(limit)

        # Get preferred categories and cuisines
        categories = {}
        cuisines = {}

        for order in user_history:
            cat = order['category']
            categories[cat] = categories.get(cat, 0) + order['order_count']

            if order['cuisines']:
                for cuisine in order['cuisines']:
                    cuisines[cuisine] = cuisines.get(cuisine, 0) + order['order_count']

        # Sort by frequency
        top_categories = sorted(categories.items(), key=lambda x: x[1], reverse=True)[:3]
        top_cuisines = sorted(cuisines.items(), key=lambda x: x[1], reverse=True)[:3]

        conn = get_db_connection()
        cur = conn.cursor()

        # Find vendors matching preferences
        category_list = [cat[0] for cat in top_categories]
        cuisine_list = [cui[0] for cui in top_cuisines]

        cur.execute("""
            SELECT v.id, v.business_name, v.average_rating,
                   (CASE WHEN v.primary_category = ANY(%s) THEN 2 ELSE 0 END +
                    CASE WHEN v.cuisines && %s THEN 1 ELSE 0 END) as relevance_score
            FROM vendors v
            WHERE v.id NOT IN (
                SELECT vendor_id FROM orders WHERE customer_id = %s
            )
            AND v.is_active = true
            AND v.is_online = true
            AND (v.primary_category = ANY(%s) OR v.cuisines && %s)
            ORDER BY relevance_score DESC, v.average_rating DESC, v.total_orders DESC
            LIMIT %s
        """, (category_list, cuisine_list, user_id, category_list, cuisine_list, limit))

        results = [row[0] for row in cur.fetchall()]
        cur.close()
        conn.close()

        return results

    def get_trending_vendors(self, limit: int = 10) -> List[str]:
        """Get trending vendors based on recent order volume"""
        cache_key = "recommendations:trending"
        cached = redis_client.get(cache_key)
        if cached:
            return eval(cached)[:limit]

        conn = get_db_connection()
        cur = conn.cursor()

        # Get vendors with most orders in last 7 days
        cur.execute("""
            SELECT v.id, v.business_name, COUNT(*) as recent_orders
            FROM orders o
            JOIN vendors v ON o.vendor_id = v.id
            WHERE o.created_at >= NOW() - INTERVAL '7 days'
              AND o.status IN ('delivered', 'in_transit', 'picked_up')
              AND v.is_active = true
              AND v.is_online = true
            GROUP BY v.id, v.business_name
            ORDER BY recent_orders DESC, v.average_rating DESC
            LIMIT %s
        """, (limit,))

        results = [row[0] for row in cur.fetchall()]
        cur.close()
        conn.close()

        # Cache for 30 minutes
        redis_client.setex(cache_key, 1800, str(results))

        return results

    def get_personalized_recommendations(self, user_id: str, limit: int = 10) -> List[Dict]:
        """Hybrid recommendations combining collaborative and content-based"""
        # Get both types of recommendations
        collaborative = self.get_collaborative_recommendations(user_id, limit)
        content_based = self.get_content_based_recommendations(user_id, limit)

        # Merge and deduplicate
        seen = set()
        merged = []

        # Alternate between collaborative and content-based
        for i in range(max(len(collaborative), len(content_based))):
            if i < len(collaborative) and collaborative[i] not in seen:
                merged.append(collaborative[i])
                seen.add(collaborative[i])
            if i < len(content_based) and content_based[i] not in seen:
                merged.append(content_based[i])
                seen.add(content_based[i])

            if len(merged) >= limit:
                break

        # Get vendor details
        if not merged:
            merged = self.get_trending_vendors(limit)

        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute("""
            SELECT id, business_name, primary_category, cuisines,
                   average_rating, average_delivery_time, price_range
            FROM vendors
            WHERE id = ANY(%s)
        """, (merged,))

        vendor_map = {row[0]: {
            'id': row[0],
            'name': row[1],
            'category': row[2],
            'cuisines': row[3],
            'rating': float(row[4]) if row[4] else 0,
            'delivery_time': row[5],
            'price_range': row[6]
        } for row in cur.fetchall()}

        cur.close()
        conn.close()

        # Return in order
        return [vendor_map[vid] for vid in merged if vid in vendor_map]

recommendation_engine = RecommendationEngine()

@app.get("/")
def read_root():
    return {"service": "recommendation-service", "status": "healthy"}

@app.get("/recommendations/{user_id}")
def get_recommendations(user_id: str, limit: int = 10):
    """Get personalized vendor recommendations for a user"""
    try:
        recommendations = recommendation_engine.get_personalized_recommendations(user_id, limit)
        return {
            "user_id": user_id,
            "recommendations": recommendations,
            "count": len(recommendations)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/trending")
def get_trending(limit: int = 10):
    """Get trending vendors"""
    try:
        trending = recommendation_engine.get_trending_vendors(limit)
        return {
            "trending": trending,
            "count": len(trending)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/similar-vendors/{vendor_id}")
def get_similar_vendors(vendor_id: str, limit: int = 5):
    """Get similar vendors based on category and cuisine"""
    try:
        conn = get_db_connection()
        cur = conn.cursor()

        # Get vendor details
        cur.execute("""
            SELECT primary_category, cuisines
            FROM vendors
            WHERE id = %s
        """, (vendor_id,))

        result = cur.fetchone()
        if not result:
            raise HTTPException(status_code=404, detail="Vendor not found")

        category, cuisines = result

        # Find similar vendors
        cur.execute("""
            SELECT id, business_name, average_rating
            FROM vendors
            WHERE id != %s
              AND is_active = true
              AND is_online = true
              AND (primary_category = %s OR cuisines && %s)
            ORDER BY average_rating DESC, total_orders DESC
            LIMIT %s
        """, (vendor_id, category, cuisines, limit))

        similar = [{'id': row[0], 'name': row[1], 'rating': float(row[2])} for row in cur.fetchall()]

        cur.close()
        conn.close()

        return {"similar_vendors": similar}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
