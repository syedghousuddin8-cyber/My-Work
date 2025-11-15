import axios from 'axios';
import { logger } from '@delivery/shared';
import { getDistance } from 'geolib';

export class ETAService {
  private readonly GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

  async calculateETA(driverId: string, orderId: string): Promise<number> {
    try {
      // Get driver current location and order destination
      // Simplified - in production, fetch from database
      const driverLocation = { latitude: 40.7128, longitude: -74.0060 };
      const destination = { latitude: 40.7614, longitude: -73.9776 };

      // Use Google Maps Distance Matrix API for accurate ETA
      const response = await axios.get('https://maps.googleapis.com/maps/api/distancematrix/json', {
        params: {
          origins: `${driverLocation.latitude},${driverLocation.longitude}`,
          destinations: `${destination.latitude},${destination.longitude}`,
          mode: 'driving',
          departure_time: 'now',
          traffic_model: 'best_guess',
          key: this.GOOGLE_MAPS_API_KEY
        }
      });

      if (response.data.rows[0]?.elements[0]?.duration_in_traffic) {
        return response.data.rows[0].elements[0].duration_in_traffic.value; // seconds
      }

      // Fallback to simple distance-based calculation
      const distance = getDistance(driverLocation, destination);
      const averageSpeedKmH = 40;
      const estimatedTimeHours = (distance / 1000) / averageSpeedKmH;
      return Math.round(estimatedTimeHours * 3600); // Convert to seconds

    } catch (error) {
      logger.error('ETA calculation error:', error);
      return 1800; // Default 30 minutes
    }
  }

  async calculateRoute(origin: any, destination: any) {
    try {
      const response = await axios.get('https://maps.googleapis.com/maps/api/directions/json', {
        params: {
          origin: `${origin.latitude},${origin.longitude}`,
          destination: `${destination.latitude},${destination.longitude}`,
          mode: 'driving',
          alternatives: true,
          key: this.GOOGLE_MAPS_API_KEY
        }
      });

      return response.data.routes[0];
    } catch (error) {
      logger.error('Route calculation error:', error);
      return null;
    }
  }
}
