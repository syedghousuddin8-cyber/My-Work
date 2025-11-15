import { redisClient } from '../config/redis';
import { mongoClient } from '../config/mongodb';
import { logger } from '@delivery/shared';
import { getDistance } from 'geolib';

export class TrackingService {
  async updateDriverLocation(driverId: string, location: { latitude: number; longitude: number; orderId?: string }) {
    const timestamp = new Date().toISOString();

    // Store current location in Redis (fast access)
    await redisClient.setEx(
      `driver:location:${driverId}`,
      300, // 5 minutes TTL
      JSON.stringify({ ...location, timestamp })
    );

    // Store location history in MongoDB
    const db = mongoClient.db('delivery_platform');
    await db.collection('location_history').insertOne({
      driverId,
      location: {
        type: 'Point',
        coordinates: [location.longitude, location.latitude]
      },
      orderId: location.orderId,
      timestamp: new Date()
    });

    logger.debug(`Driver ${driverId} location updated`);
  }

  async getDriverLocation(driverId: string) {
    const locationData = await redisClient.get(`driver:location:${driverId}`);
    return locationData ? JSON.parse(locationData) : null;
  }

  async getNearbyDrivers(location: { latitude: number; longitude: number }, radiusKm: number = 10) {
    // Get all online drivers from Redis
    const driverKeys = await redisClient.keys('driver:location:*');
    const nearbyDrivers = [];

    for (const key of driverKeys) {
      const driverData = await redisClient.get(key);
      if (driverData) {
        const driver = JSON.parse(driverData);
        const distance = getDistance(
          { latitude: location.latitude, longitude: location.longitude },
          { latitude: driver.latitude, longitude: driver.longitude }
        );

        if (distance <= radiusKm * 1000) { // Convert km to meters
          nearbyDrivers.push({
            driverId: key.replace('driver:location:', ''),
            location: driver,
            distance: distance / 1000 // Convert to km
          });
        }
      }
    }

    return nearbyDrivers.sort((a, b) => a.distance - b.distance);
  }

  async getLocationHistory(driverId: string, orderId: string) {
    const db = mongoClient.db('delivery_platform');
    const history = await db.collection('location_history')
      .find({ driverId, orderId })
      .sort({ timestamp: 1 })
      .toArray();

    return history;
  }
}
