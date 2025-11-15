import { DatabaseClient } from '../config/database';
import { RedisClient } from '../config/redis';
import { KafkaProducer } from '../config/kafka';

interface TransactionData {
  userId: string;
  userType: 'customer' | 'vendor' | 'driver';
  orderId?: string;
  amount?: number;
  location?: {
    latitude: number;
    longitude: number;
  };
  ipAddress?: string;
  deviceId?: string;
  timestamp: Date;
}

interface RiskScore {
  score: number; // 0-100 (100 = highest risk)
  level: 'low' | 'medium' | 'high' | 'critical';
  reasons: string[];
  requiresReview: boolean;
  shouldBlock: boolean;
}

interface UserBehaviorProfile {
  userId: string;
  averageOrderValue: number;
  orderFrequency: number; // orders per day
  typicalLocations: Array<{ lat: number; lng: number }>;
  typicalOrderTimes: number[]; // hours of day
  accountAge: number; // days
  totalOrders: number;
  successfulOrders: number;
  cancelledOrders: number;
  refundedOrders: number;
}

export class FraudDetectorService {
  private dbClient = DatabaseClient.getInstance();
  private redisClient = RedisClient.getInstance();
  private kafkaProducer = KafkaProducer.getInstance();

  // Risk thresholds
  private readonly RISK_THRESHOLDS = {
    low: 30,
    medium: 50,
    high: 70,
    critical: 85,
  };

  /**
   * Analyze transaction for fraud
   */
  async analyzeTransaction(data: TransactionData): Promise<RiskScore> {
    const reasons: string[] = [];
    let score = 0;

    // Get user behavior profile
    const profile = await this.getUserBehaviorProfile(data.userId);

    // Rule 1: Unusual order value
    if (data.amount && profile) {
      const valueAnomaly = this.detectValueAnomaly(data.amount, profile);
      if (valueAnomaly.isAnomaly) {
        score += valueAnomaly.severity;
        reasons.push(valueAnomaly.reason);
      }
    }

    // Rule 2: Unusual location
    if (data.location && profile) {
      const locationAnomaly = this.detectLocationAnomaly(data.location, profile);
      if (locationAnomaly.isAnomaly) {
        score += locationAnomaly.severity;
        reasons.push(locationAnomaly.reason);
      }
    }

    // Rule 3: Rapid-fire orders
    const rapidOrders = await this.detectRapidOrders(data.userId);
    if (rapidOrders.detected) {
      score += rapidOrders.severity;
      reasons.push(rapidOrders.reason);
    }

    // Rule 4: Account age and history
    if (profile) {
      const newAccountRisk = this.assessNewAccountRisk(profile);
      if (newAccountRisk.risk > 0) {
        score += newAccountRisk.risk;
        reasons.push(newAccountRisk.reason);
      }
    }

    // Rule 5: IP/Device patterns
    if (data.ipAddress) {
      const ipRisk = await this.detectIPAnomaly(data.ipAddress, data.userId);
      if (ipRisk.detected) {
        score += ipRisk.severity;
        reasons.push(ipRisk.reason);
      }
    }

    // Rule 6: Cancellation/Refund rate
    if (profile) {
      const cancelRisk = this.detectHighCancellationRate(profile);
      if (cancelRisk.risk > 0) {
        score += cancelRisk.risk;
        reasons.push(cancelRisk.reason);
      }
    }

    // Rule 7: Time-based anomaly
    if (profile) {
      const timeAnomaly = this.detectTimeAnomaly(data.timestamp, profile);
      if (timeAnomaly.isAnomaly) {
        score += timeAnomaly.severity;
        reasons.push(timeAnomaly.reason);
      }
    }

    // Cap score at 100
    score = Math.min(score, 100);

    // Determine risk level
    let level: RiskScore['level'] = 'low';
    if (score >= this.RISK_THRESHOLDS.critical) level = 'critical';
    else if (score >= this.RISK_THRESHOLDS.high) level = 'high';
    else if (score >= this.RISK_THRESHOLDS.medium) level = 'medium';

    const requiresReview = score >= this.RISK_THRESHOLDS.medium;
    const shouldBlock = score >= this.RISK_THRESHOLDS.critical;

    const riskScore: RiskScore = {
      score,
      level,
      reasons,
      requiresReview,
      shouldBlock,
    };

    // Log high-risk transactions
    if (requiresReview) {
      await this.logSuspiciousActivity(data, riskScore);
    }

    // Send alert for critical risks
    if (shouldBlock) {
      await this.sendFraudAlert(data, riskScore);
    }

    return riskScore;
  }

  /**
   * Get user behavior profile
   */
  private async getUserBehaviorProfile(
    userId: string
  ): Promise<UserBehaviorProfile | null> {
    const cacheKey = `user:profile:${userId}`;

    // Check cache
    const cached = await this.redisClient.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    // Query database
    const query = `
      SELECT
        u.id as user_id,
        u.created_at,
        COUNT(o.id) as total_orders,
        COUNT(CASE WHEN o.status = 'delivered' THEN 1 END) as successful_orders,
        COUNT(CASE WHEN o.status = 'cancelled' THEN 1 END) as cancelled_orders,
        COUNT(CASE WHEN o.payment_status = 'refunded' THEN 1 END) as refunded_orders,
        AVG(o.total) as avg_order_value,
        EXTRACT(EPOCH FROM (NOW() - u.created_at)) / 86400 as account_age_days
      FROM users u
      LEFT JOIN orders o ON u.id = o.customer_id
      WHERE u.id = $1
      GROUP BY u.id, u.created_at
    `;

    const result = await this.dbClient.query(query, [userId]);

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];

    const profile: UserBehaviorProfile = {
      userId,
      averageOrderValue: parseFloat(row.avg_order_value) || 0,
      orderFrequency: row.total_orders / Math.max(row.account_age_days, 1),
      typicalLocations: [], // Could be populated from order history
      typicalOrderTimes: [], // Could be populated from order history
      accountAge: row.account_age_days || 0,
      totalOrders: parseInt(row.total_orders) || 0,
      successfulOrders: parseInt(row.successful_orders) || 0,
      cancelledOrders: parseInt(row.cancelled_orders) || 0,
      refundedOrders: parseInt(row.refunded_orders) || 0,
    };

    // Cache for 1 hour
    await this.redisClient.setEx(cacheKey, 3600, JSON.stringify(profile));

    return profile;
  }

  /**
   * Detect value anomaly
   */
  private detectValueAnomaly(
    amount: number,
    profile: UserBehaviorProfile
  ): { isAnomaly: boolean; severity: number; reason: string } {
    if (profile.totalOrders < 5) {
      return { isAnomaly: false, severity: 0, reason: '' };
    }

    const avgValue = profile.averageOrderValue;
    const deviation = Math.abs(amount - avgValue) / avgValue;

    // If order is 3x higher than average
    if (deviation > 2) {
      return {
        isAnomaly: true,
        severity: 25,
        reason: `Order value (${amount}) is ${(deviation * 100).toFixed(0)}% higher than average (${avgValue.toFixed(2)})`,
      };
    }

    return { isAnomaly: false, severity: 0, reason: '' };
  }

  /**
   * Detect location anomaly
   */
  private detectLocationAnomaly(
    location: { latitude: number; longitude: number },
    profile: UserBehaviorProfile
  ): { isAnomaly: boolean; severity: number; reason: string } {
    // Simplified: Check if location is > 100km from typical locations
    // In production, use more sophisticated clustering
    if (profile.typicalLocations.length < 3) {
      return { isAnomaly: false, severity: 0, reason: '' };
    }

    const distances = profile.typicalLocations.map((loc) =>
      this.calculateDistance(location.latitude, location.longitude, loc.lat, loc.lng)
    );

    const minDistance = Math.min(...distances);

    if (minDistance > 100) {
      // > 100km from typical location
      return {
        isAnomaly: true,
        severity: 20,
        reason: `Order location is ${minDistance.toFixed(0)}km from typical locations`,
      };
    }

    return { isAnomaly: false, severity: 0, reason: '' };
  }

  /**
   * Detect rapid-fire orders (velocity check)
   */
  private async detectRapidOrders(
    userId: string
  ): Promise<{ detected: boolean; severity: number; reason: string }> {
    const key = `rapid:orders:${userId}`;

    // Get order count in last 10 minutes
    const count = await this.redisClient.incr(key);
    await this.redisClient.expire(key, 600); // 10 minutes

    if (count > 10) {
      return {
        detected: true,
        severity: 30,
        reason: `${count} orders placed in last 10 minutes (possible bot)`,
      };
    } else if (count > 5) {
      return {
        detected: true,
        severity: 15,
        reason: `${count} orders placed in last 10 minutes (unusual velocity)`,
      };
    }

    return { detected: false, severity: 0, reason: '' };
  }

  /**
   * Assess new account risk
   */
  private assessNewAccountRisk(
    profile: UserBehaviorProfile
  ): { risk: number; reason: string } {
    // High-value order from new account
    if (profile.accountAge < 1 && profile.averageOrderValue > 100) {
      return {
        risk: 20,
        reason: 'New account (< 1 day old) with high-value order',
      };
    }

    // Account with no history
    if (profile.totalOrders === 0) {
      return {
        risk: 10,
        reason: 'First order from this account',
      };
    }

    return { risk: 0, reason: '' };
  }

  /**
   * Detect IP anomaly
   */
  private async detectIPAnomaly(
    ipAddress: string,
    userId: string
  ): Promise<{ detected: boolean; severity: number; reason: string }> {
    const key = `ip:users:${ipAddress}`;

    // Track unique users from this IP
    await this.redisClient.sAdd(key, userId);
    await this.redisClient.expire(key, 86400); // 24 hours

    const uniqueUsers = await this.redisClient.sCard(key);

    if (uniqueUsers > 10) {
      return {
        detected: true,
        severity: 25,
        reason: `${uniqueUsers} different accounts used from same IP in 24 hours`,
      };
    }

    return { detected: false, severity: 0, reason: '' };
  }

  /**
   * Detect high cancellation/refund rate
   */
  private detectHighCancellationRate(
    profile: UserBehaviorProfile
  ): { risk: number; reason: string } {
    if (profile.totalOrders < 5) {
      return { risk: 0, reason: '' };
    }

    const cancelRate = profile.cancelledOrders / profile.totalOrders;
    const refundRate = profile.refundedOrders / profile.totalOrders;

    if (cancelRate > 0.5) {
      return {
        risk: 20,
        reason: `High cancellation rate: ${(cancelRate * 100).toFixed(0)}%`,
      };
    }

    if (refundRate > 0.3) {
      return {
        risk: 15,
        reason: `High refund rate: ${(refundRate * 100).toFixed(0)}%`,
      };
    }

    return { risk: 0, reason: '' };
  }

  /**
   * Detect time-based anomaly
   */
  private detectTimeAnomaly(
    timestamp: Date,
    profile: UserBehaviorProfile
  ): { isAnomaly: boolean; severity: number; reason: string } {
    const hour = timestamp.getHours();

    // Unusual hours (2am - 5am)
    if (hour >= 2 && hour <= 5 && profile.totalOrders > 10) {
      return {
        isAnomaly: true,
        severity: 10,
        reason: 'Order placed during unusual hours (2am-5am)',
      };
    }

    return { isAnomaly: false, severity: 0, reason: '' };
  }

  /**
   * Log suspicious activity
   */
  private async logSuspiciousActivity(
    data: TransactionData,
    riskScore: RiskScore
  ): Promise<void> {
    const query = `
      INSERT INTO fraud_alerts (
        user_id, user_type, order_id, risk_score, risk_level,
        reasons, ip_address, device_id, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
    `;

    await this.dbClient.query(query, [
      data.userId,
      data.userType,
      data.orderId || null,
      riskScore.score,
      riskScore.level,
      JSON.stringify(riskScore.reasons),
      data.ipAddress || null,
      data.deviceId || null,
    ]);
  }

  /**
   * Send fraud alert via Kafka
   */
  private async sendFraudAlert(
    data: TransactionData,
    riskScore: RiskScore
  ): Promise<void> {
    await this.kafkaProducer.send({
      topic: 'fraud.detected',
      messages: [
        {
          key: data.userId,
          value: JSON.stringify({
            userId: data.userId,
            userType: data.userType,
            orderId: data.orderId,
            riskScore: riskScore.score,
            riskLevel: riskScore.level,
            reasons: riskScore.reasons,
            timestamp: new Date().toISOString(),
          }),
        },
      ],
    });
  }

  /**
   * Calculate distance between two coordinates (Haversine)
   */
  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  /**
   * Get fraud statistics
   */
  async getFraudStatistics(days: number = 7): Promise<any> {
    const query = `
      SELECT
        COUNT(*) as total_alerts,
        COUNT(CASE WHEN risk_level = 'critical' THEN 1 END) as critical_alerts,
        COUNT(CASE WHEN risk_level = 'high' THEN 1 END) as high_alerts,
        COUNT(CASE WHEN risk_level = 'medium' THEN 1 END) as medium_alerts,
        AVG(risk_score) as avg_risk_score
      FROM fraud_alerts
      WHERE created_at > NOW() - INTERVAL '${days} days'
    `;

    const result = await this.dbClient.query(query);

    return result.rows[0];
  }
}

export default new FraudDetectorService();
