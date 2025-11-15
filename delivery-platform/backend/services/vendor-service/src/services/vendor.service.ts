import { query } from '../config/database';
import { redisClient } from '../config/redis';
import { publishEvent } from '../config/kafka';
import { esClient } from '../config/elasticsearch';
import { logger } from '@delivery/shared';

export class VendorService {
  // Create vendor profile
  async createVendor(userId: string, vendorData: any) {
    const client = await query('BEGIN');

    try {
      // Insert vendor
      const vendorResult = await query(
        `INSERT INTO vendors (
          user_id, business_name, business_type, description,
          primary_category, categories, cuisines, logo_url,
          banner_url, address, city, state, zip_code, country,
          latitude, longitude, phone, email, website,
          tax_id, business_license, price_range
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22)
        RETURNING *`,
        [
          userId,
          vendorData.businessName,
          vendorData.businessType,
          vendorData.description,
          vendorData.primaryCategory,
          vendorData.categories,
          vendorData.cuisines || [],
          vendorData.logoUrl,
          vendorData.bannerUrl,
          vendorData.address,
          vendorData.city,
          vendorData.state,
          vendorData.zipCode,
          vendorData.country,
          vendorData.latitude,
          vendorData.longitude,
          vendorData.phone,
          vendorData.email,
          vendorData.website,
          vendorData.taxId,
          vendorData.businessLicense,
          vendorData.priceRange || '$$',
        ]
      );

      const vendor = vendorResult.rows[0];

      // Insert operating hours
      if (vendorData.operatingHours) {
        for (const hours of vendorData.operatingHours) {
          await query(
            `INSERT INTO vendor_operating_hours (vendor_id, day_of_week, open_time, close_time, is_closed)
             VALUES ($1, $2, $3, $4, $5)`,
            [vendor.id, hours.dayOfWeek, hours.openTime, hours.closeTime, hours.isClosed || false]
          );
        }
      }

      // Insert delivery zones
      if (vendorData.deliveryZones) {
        for (const zone of vendorData.deliveryZones) {
          await query(
            `INSERT INTO vendor_delivery_zones (vendor_id, zip_code, delivery_fee, minimum_order, estimated_time)
             VALUES ($1, $2, $3, $4, $5)`,
            [vendor.id, zone.zipCode, zone.deliveryFee, zone.minimumOrder, zone.estimatedTime]
          );
        }
      }

      await query('COMMIT');

      // Index in Elasticsearch
      await this.indexVendor(vendor);

      // Cache vendor
      await redisClient.setEx(
        `vendor:${vendor.id}`,
        3600,
        JSON.stringify(vendor)
      );

      // Publish event
      await publishEvent('vendor.created', {
        vendorId: vendor.id,
        userId,
        businessName: vendor.business_name,
        category: vendor.primary_category,
        timestamp: new Date().toISOString(),
      });

      logger.info(`Vendor created: ${vendor.id}`);
      return vendor;
    } catch (error) {
      await query('ROLLBACK');
      logger.error('Create vendor error:', error);
      throw error;
    }
  }

  // Get vendor by ID
  async getVendor(vendorId: string) {
    // Check cache first
    const cached = await redisClient.get(`vendor:${vendorId}`);
    if (cached) {
      return JSON.parse(cached);
    }

    const result = await query(
      `SELECT v.*,
        json_agg(DISTINCT jsonb_build_object(
          'dayOfWeek', voh.day_of_week,
          'openTime', voh.open_time,
          'closeTime', voh.close_time,
          'isClosed', voh.is_closed
        )) FILTER (WHERE voh.id IS NOT NULL) as operating_hours,
        json_agg(DISTINCT jsonb_build_object(
          'zipCode', vdz.zip_code,
          'deliveryFee', vdz.delivery_fee,
          'minimumOrder', vdz.minimum_order,
          'estimatedTime', vdz.estimated_time
        )) FILTER (WHERE vdz.id IS NOT NULL) as delivery_zones
       FROM vendors v
       LEFT JOIN vendor_operating_hours voh ON v.id = voh.vendor_id
       LEFT JOIN vendor_delivery_zones vdz ON v.id = vdz.vendor_id
       WHERE v.id = $1
       GROUP BY v.id`,
      [vendorId]
    );

    if (result.rows.length === 0) {
      return null;
    }

    const vendor = result.rows[0];

    // Cache for 1 hour
    await redisClient.setEx(
      `vendor:${vendorId}`,
      3600,
      JSON.stringify(vendor)
    );

    return vendor;
  }

  // Update vendor profile
  async updateVendor(vendorId: string, updates: any) {
    const result = await query(
      `UPDATE vendors SET
        business_name = COALESCE($2, business_name),
        description = COALESCE($3, description),
        categories = COALESCE($4, categories),
        cuisines = COALESCE($5, cuisines),
        logo_url = COALESCE($6, logo_url),
        banner_url = COALESCE($7, banner_url),
        phone = COALESCE($8, phone),
        website = COALESCE($9, website),
        price_range = COALESCE($10, price_range),
        updated_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING *`,
      [
        vendorId,
        updates.businessName,
        updates.description,
        updates.categories,
        updates.cuisines,
        updates.logoUrl,
        updates.bannerUrl,
        updates.phone,
        updates.website,
        updates.priceRange,
      ]
    );

    if (result.rows.length === 0) {
      throw new Error('Vendor not found');
    }

    const vendor = result.rows[0];

    // Update cache
    await redisClient.del(`vendor:${vendorId}`);

    // Update Elasticsearch
    await this.indexVendor(vendor);

    // Publish event
    await publishEvent('vendor.updated', {
      vendorId,
      updates,
      timestamp: new Date().toISOString(),
    });

    return vendor;
  }

  // Toggle vendor online/offline status
  async toggleOnlineStatus(vendorId: string, isOnline: boolean) {
    const result = await query(
      `UPDATE vendors SET is_online = $2, updated_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING *`,
      [vendorId, isOnline]
    );

    if (result.rows.length === 0) {
      throw new Error('Vendor not found');
    }

    // Update cache and ES
    await redisClient.del(`vendor:${vendorId}`);
    await this.indexVendor(result.rows[0]);

    // Publish event
    await publishEvent('vendor.status_changed', {
      vendorId,
      isOnline,
      timestamp: new Date().toISOString(),
    });

    return result.rows[0];
  }

  // Search vendors with filters
  async searchVendors(filters: any) {
    const { query, category, cuisines, priceRange, rating, location, radius, limit = 20, offset = 0 } = filters;

    const must: any[] = [
      { term: { isActive: true } },
      { term: { isOnline: true } },
    ];

    if (query) {
      must.push({
        multi_match: {
          query,
          fields: ['name^3', 'description', 'tags'],
          fuzziness: 'AUTO',
        },
      });
    }

    if (category) {
      must.push({ term: { categories: category } });
    }

    if (cuisines && cuisines.length > 0) {
      must.push({ terms: { cuisines } });
    }

    if (priceRange) {
      must.push({ term: { priceRange } });
    }

    if (rating) {
      must.push({ range: { rating: { gte: rating } } });
    }

    const body: any = {
      query: {
        bool: { must },
      },
      sort: [
        { rating: { order: 'desc' } },
        { totalOrders: { order: 'desc' } },
      ],
      from: offset,
      size: limit,
    };

    // Add geo-distance filter if location provided
    if (location && location.lat && location.lng) {
      body.query.bool.filter = {
        geo_distance: {
          distance: `${radius || 10}km`,
          location: {
            lat: location.lat,
            lon: location.lng,
          },
        },
      };
      body.sort.unshift({
        _geo_distance: {
          location: {
            lat: location.lat,
            lon: location.lng,
          },
          order: 'asc',
          unit: 'km',
        },
      });
    }

    const result = await esClient.search({
      index: 'vendors',
      body,
    });

    return {
      total: result.hits.total,
      vendors: result.hits.hits.map((hit: any) => ({
        ...hit._source,
        distance: hit.sort ? hit.sort[0] : null,
      })),
    };
  }

  // Get vendor analytics
  async getVendorAnalytics(vendorId: string, startDate: Date, endDate: Date) {
    const result = await query(
      `SELECT
        COUNT(*) as total_orders,
        SUM(total_amount) as total_revenue,
        AVG(total_amount) as average_order_value,
        COUNT(DISTINCT customer_id) as unique_customers,
        AVG(vendor_rating) as average_rating
       FROM orders
       WHERE vendor_id = $1 AND created_at BETWEEN $2 AND $3`,
      [vendorId, startDate, endDate]
    );

    const popularItems = await query(
      `SELECT mi.name, SUM(oi.quantity) as total_sold, SUM(oi.subtotal) as revenue
       FROM order_items oi
       JOIN menu_items mi ON oi.menu_item_id = mi.id
       JOIN orders o ON oi.order_id = o.id
       WHERE o.vendor_id = $1 AND o.created_at BETWEEN $2 AND $3
       GROUP BY mi.id, mi.name
       ORDER BY total_sold DESC
       LIMIT 10`,
      [vendorId, startDate, endDate]
    );

    return {
      summary: result.rows[0],
      popularItems: popularItems.rows,
    };
  }

  // Index vendor in Elasticsearch
  private async indexVendor(vendor: any) {
    try {
      await esClient.index({
        index: 'vendors',
        id: vendor.id,
        document: {
          id: vendor.id,
          name: vendor.business_name,
          description: vendor.description,
          categories: vendor.categories,
          cuisines: vendor.cuisines,
          tags: vendor.tags || [],
          rating: parseFloat(vendor.average_rating) || 0,
          totalOrders: parseInt(vendor.total_orders) || 0,
          priceRange: vendor.price_range,
          location: {
            lat: parseFloat(vendor.latitude),
            lon: parseFloat(vendor.longitude),
          },
          isActive: vendor.is_active,
          isOnline: vendor.is_online,
          deliveryTime: vendor.average_delivery_time || 30,
          deliveryFee: parseFloat(vendor.base_delivery_fee) || 0,
          minimumOrder: parseFloat(vendor.minimum_order) || 0,
          createdAt: vendor.created_at,
          updatedAt: vendor.updated_at,
        },
      });

      logger.debug(`Vendor indexed in Elasticsearch: ${vendor.id}`);
    } catch (error) {
      logger.error('Elasticsearch indexing error:', error);
    }
  }
}
