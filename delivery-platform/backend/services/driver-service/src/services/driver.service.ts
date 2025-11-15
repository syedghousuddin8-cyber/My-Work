import { query } from '../config/database';
import { redisClient } from '../config/redis';
import { publishEvent } from '../config/kafka';
import { getDB } from '../config/mongodb';
import { logger } from '@delivery/shared';
import { getDistance } from 'geolib';

export class DriverService {
  // Create driver profile
  async createDriver(userId: string, driverData: any) {
    const client = await query('BEGIN');

    try {
      // Insert driver
      const driverResult = await query(
        `INSERT INTO drivers (
          user_id, first_name, last_name, phone, email,
          date_of_birth, profile_photo_url, address, city, state, zip_code, country,
          license_number, license_expiry, license_state,
          vehicle_type, vehicle_make, vehicle_model, vehicle_year,
          vehicle_color, vehicle_plate_number, insurance_policy_number,
          insurance_expiry, background_check_status, is_approved
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25)
        RETURNING *`,
        [
          userId,
          driverData.firstName,
          driverData.lastName,
          driverData.phone,
          driverData.email,
          driverData.dateOfBirth,
          driverData.profilePhotoUrl,
          driverData.address,
          driverData.city,
          driverData.state,
          driverData.zipCode,
          driverData.country,
          driverData.licenseNumber,
          driverData.licenseExpiry,
          driverData.licenseState,
          driverData.vehicleType,
          driverData.vehicleMake,
          driverData.vehicleModel,
          driverData.vehicleYear,
          driverData.vehicleColor,
          driverData.vehiclePlateNumber,
          driverData.insurancePolicyNumber,
          driverData.insuranceExpiry,
          'pending',
          false,
        ]
      );

      const driver = driverResult.rows[0];

      await query('COMMIT');

      // Cache driver
      await redisClient.setEx(
        `driver:${driver.id}`,
        3600,
        JSON.stringify(driver)
      );

      // Publish event
      await publishEvent('driver.registered', {
        driverId: driver.id,
        userId,
        name: `${driver.first_name} ${driver.last_name}`,
        vehicleType: driver.vehicle_type,
        timestamp: new Date().toISOString(),
      });

      logger.info(`Driver registered: ${driver.id}`);
      return driver;
    } catch (error) {
      await query('ROLLBACK');
      logger.error('Create driver error:', error);
      throw error;
    }
  }

  // Get driver by ID
  async getDriver(driverId: string) {
    // Check cache
    const cached = await redisClient.get(`driver:${driverId}`);
    if (cached) {
      return JSON.parse(cached);
    }

    const result = await query(
      `SELECT d.*,
        (SELECT COUNT(*) FROM orders WHERE driver_id = d.id AND status = 'delivered') as total_deliveries,
        (SELECT AVG(driver_rating) FROM orders WHERE driver_id = d.id AND driver_rating IS NOT NULL) as average_rating
       FROM drivers d
       WHERE d.id = $1`,
      [driverId]
    );

    if (result.rows.length === 0) {
      return null;
    }

    const driver = result.rows[0];

    // Cache for 1 hour
    await redisClient.setEx(
      `driver:${driverId}`,
      3600,
      JSON.stringify(driver)
    );

    return driver;
  }

  // Update driver profile
  async updateDriver(driverId: string, updates: any) {
    const result = await query(
      `UPDATE drivers SET
        first_name = COALESCE($2, first_name),
        last_name = COALESCE($3, last_name),
        phone = COALESCE($4, phone),
        profile_photo_url = COALESCE($5, profile_photo_url),
        address = COALESCE($6, address),
        city = COALESCE($7, city),
        state = COALESCE($8, state),
        zip_code = COALESCE($9, zip_code),
        vehicle_type = COALESCE($10, vehicle_type),
        vehicle_make = COALESCE($11, vehicle_make),
        vehicle_model = COALESCE($12, vehicle_model),
        vehicle_year = COALESCE($13, vehicle_year),
        vehicle_color = COALESCE($14, vehicle_color),
        vehicle_plate_number = COALESCE($15, vehicle_plate_number),
        updated_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING *`,
      [
        driverId,
        updates.firstName,
        updates.lastName,
        updates.phone,
        updates.profilePhotoUrl,
        updates.address,
        updates.city,
        updates.state,
        updates.zipCode,
        updates.vehicleType,
        updates.vehicleMake,
        updates.vehicleModel,
        updates.vehicleYear,
        updates.vehicleColor,
        updates.vehiclePlateNumber,
      ]
    );

    if (result.rows.length === 0) {
      throw new Error('Driver not found');
    }

    const driver = result.rows[0];

    // Update cache
    await redisClient.del(`driver:${driverId}`);

    // Publish event
    await publishEvent('driver.updated', {
      driverId,
      updates,
      timestamp: new Date().toISOString(),
    });

    return driver;
  }

  // Toggle driver online/offline status
  async toggleOnlineStatus(driverId: string, isOnline: boolean, location?: { latitude: number; longitude: number }) {
    const result = await query(
      `UPDATE drivers SET
        is_online = $2,
        current_latitude = COALESCE($3, current_latitude),
        current_longitude = COALESCE($4, current_longitude),
        last_seen_at = CURRENT_TIMESTAMP,
        updated_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING *`,
      [driverId, isOnline, location?.latitude, location?.longitude]
    );

    if (result.rows.length === 0) {
      throw new Error('Driver not found');
    }

    const driver = result.rows[0];

    // Update cache
    await redisClient.del(`driver:${driverId}`);

    if (isOnline && location) {
      // Add to online drivers geo set
      await redisClient.geoAdd('drivers:online', {
        longitude: location.longitude,
        latitude: location.latitude,
        member: driverId,
      });

      // Start shift in MongoDB
      const db = getDB();
      await db.collection('driver_shifts').insertOne({
        driverId,
        startTime: new Date(),
        startLocation: location,
        isActive: true,
      });
    } else if (!isOnline) {
      // Remove from online drivers
      await redisClient.zRem('drivers:online', driverId);

      // End shift in MongoDB
      const db = getDB();
      await db.collection('driver_shifts').updateOne(
        { driverId, isActive: true },
        {
          $set: {
            endTime: new Date(),
            isActive: false,
          },
        }
      );
    }

    // Publish event
    await publishEvent('driver.status_changed', {
      driverId,
      isOnline,
      location,
      timestamp: new Date().toISOString(),
    });

    return driver;
  }

  // Find nearby available drivers
  async findNearbyDrivers(location: { latitude: number; longitude: number }, radius: number = 5, vehicleType?: string) {
    // Get drivers within radius using Redis GEO commands
    const nearbyDriverIds = await redisClient.geoRadius(
      'drivers:online',
      { longitude: location.longitude, latitude: location.latitude },
      radius,
      'km',
      { WITHDIST: true, SORT: 'ASC' }
    );

    if (!nearbyDriverIds || nearbyDriverIds.length === 0) {
      return [];
    }

    // Get driver details from database
    const driverIds = nearbyDriverIds.map((item: any) => item.member);

    let queryText = `
      SELECT d.*,
        (SELECT COUNT(*) FROM orders WHERE driver_id = d.id AND status IN ('picked_up', 'in_transit')) as active_orders
      FROM drivers d
      WHERE d.id = ANY($1)
        AND d.is_online = true
        AND d.is_approved = true
        AND d.is_active = true
    `;
    const params: any[] = [driverIds];

    if (vehicleType) {
      queryText += ' AND d.vehicle_type = $2';
      params.push(vehicleType);
    }

    queryText += ' ORDER BY d.average_rating DESC, d.total_deliveries DESC';

    const result = await query(queryText, params);

    // Filter out drivers with active orders and add distance
    const availableDrivers = result.rows
      .filter((driver: any) => driver.active_orders === 0)
      .map((driver: any) => {
        const distanceInfo = nearbyDriverIds.find((item: any) => item.member === driver.id);
        return {
          ...driver,
          distance: distanceInfo ? parseFloat(distanceInfo.distance) : null,
        };
      });

    return availableDrivers;
  }

  // Get driver earnings
  async getDriverEarnings(driverId: string, startDate: Date, endDate: Date) {
    const result = await query(
      `SELECT
        COUNT(*) as total_deliveries,
        SUM(driver_earnings) as total_earnings,
        AVG(driver_earnings) as average_earnings_per_delivery,
        SUM(CASE WHEN tip_amount > 0 THEN tip_amount ELSE 0 END) as total_tips
       FROM orders
       WHERE driver_id = $1
         AND status = 'delivered'
         AND delivered_at BETWEEN $2 AND $3`,
      [driverId, startDate, endDate]
    );

    const summary = result.rows[0];

    // Get daily breakdown from MongoDB
    const db = getDB();
    const dailyEarnings = await db
      .collection('driver_earnings')
      .find({
        driverId,
        date: { $gte: startDate, $lte: endDate },
      })
      .sort({ date: -1 })
      .toArray();

    return {
      summary,
      dailyEarnings,
    };
  }

  // Record earnings (called when order is completed)
  async recordEarnings(driverId: string, orderId: string, earnings: number, tip: number) {
    const db = getDB();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await db.collection('driver_earnings').updateOne(
      { driverId, date: today },
      {
        $inc: {
          totalEarnings: earnings,
          totalTips: tip,
          deliveryCount: 1,
        },
        $push: {
          orders: {
            orderId,
            earnings,
            tip,
            completedAt: new Date(),
          },
        },
      },
      { upsert: true }
    );

    logger.info(`Earnings recorded for driver ${driverId}: $${earnings + tip}`);

    // Publish event
    await publishEvent('driver.earnings_recorded', {
      driverId,
      orderId,
      earnings,
      tip,
      timestamp: new Date().toISOString(),
    });
  }

  // Get driver statistics
  async getDriverStats(driverId: string) {
    const result = await query(
      `SELECT
        COUNT(*) FILTER (WHERE status = 'delivered') as total_deliveries,
        COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled_deliveries,
        AVG(driver_rating) FILTER (WHERE driver_rating IS NOT NULL) as average_rating,
        COUNT(*) FILTER (WHERE driver_rating = 5) as five_star_ratings,
        SUM(driver_earnings) as lifetime_earnings,
        AVG(EXTRACT(EPOCH FROM (delivered_at - accepted_at))/60) FILTER (WHERE delivered_at IS NOT NULL AND accepted_at IS NOT NULL) as average_delivery_time_minutes
       FROM orders
       WHERE driver_id = $1`,
      [driverId]
    );

    const stats = result.rows[0];

    // Get current month earnings
    const firstDayOfMonth = new Date();
    firstDayOfMonth.setDate(1);
    firstDayOfMonth.setHours(0, 0, 0, 0);

    const monthEarnings = await query(
      `SELECT SUM(driver_earnings + tip_amount) as month_earnings
       FROM orders
       WHERE driver_id = $1 AND delivered_at >= $2 AND status = 'delivered'`,
      [driverId, firstDayOfMonth]
    );

    stats.current_month_earnings = monthEarnings.rows[0].month_earnings || 0;

    return stats;
  }

  // Update driver documents
  async updateDocuments(driverId: string, documents: any) {
    const result = await query(
      `UPDATE drivers SET
        license_number = COALESCE($2, license_number),
        license_expiry = COALESCE($3, license_expiry),
        insurance_policy_number = COALESCE($4, insurance_policy_number),
        insurance_expiry = COALESCE($5, insurance_expiry),
        updated_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING *`,
      [
        driverId,
        documents.licenseNumber,
        documents.licenseExpiry,
        documents.insurancePolicyNumber,
        documents.insuranceExpiry,
      ]
    );

    if (result.rows.length === 0) {
      throw new Error('Driver not found');
    }

    await redisClient.del(`driver:${driverId}`);

    return result.rows[0];
  }

  // Approve driver (admin only)
  async approveDriver(driverId: string, isApproved: boolean) {
    const result = await query(
      `UPDATE drivers SET
        is_approved = $2,
        background_check_status = $3,
        updated_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING *`,
      [driverId, isApproved, isApproved ? 'approved' : 'rejected']
    );

    if (result.rows.length === 0) {
      throw new Error('Driver not found');
    }

    await redisClient.del(`driver:${driverId}`);

    // Publish event
    await publishEvent('driver.approval_status_changed', {
      driverId,
      isApproved,
      timestamp: new Date().toISOString(),
    });

    return result.rows[0];
  }
}
