import axios from 'axios';
import { RedisClient } from '../config/redis';

interface Location {
  latitude: number;
  longitude: number;
  address: string;
  orderId?: string;
}

interface RouteStop {
  location: Location;
  orderId?: string;
  sequenceNumber: number;
  estimatedArrival: Date;
  distance: number; // from previous stop in meters
  duration: number; // from previous stop in seconds
}

interface OptimizedRoute {
  driverId: string;
  startLocation: Location;
  stops: RouteStop[];
  totalDistance: number; // in meters
  totalDuration: number; // in seconds
  estimatedCompletion: Date;
}

interface TrafficData {
  level: 'low' | 'medium' | 'high' | 'severe';
  delayMinutes: number;
}

export class RouteOptimizerService {
  private redisClient = RedisClient.getInstance();
  private readonly GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY || '';

  /**
   * Optimize route for multiple deliveries using nearest neighbor algorithm
   */
  async optimizeRoute(
    driverId: string,
    startLocation: Location,
    deliveryLocations: Location[]
  ): Promise<OptimizedRoute> {
    if (deliveryLocations.length === 0) {
      return {
        driverId,
        startLocation,
        stops: [],
        totalDistance: 0,
        totalDuration: 0,
        estimatedCompletion: new Date(),
      };
    }

    // Use nearest neighbor algorithm for route optimization
    const optimizedStops = await this.nearestNeighborOptimization(
      startLocation,
      deliveryLocations
    );

    // Get detailed route information from Google Maps
    const routeDetails = await this.getDetailedRoute(
      startLocation,
      optimizedStops
    );

    const estimatedCompletion = new Date(
      Date.now() + routeDetails.totalDuration * 1000
    );

    return {
      driverId,
      startLocation,
      stops: routeDetails.stops,
      totalDistance: routeDetails.totalDistance,
      totalDuration: routeDetails.totalDuration,
      estimatedCompletion,
    };
  }

  /**
   * Nearest Neighbor algorithm for TSP (Traveling Salesman Problem)
   */
  private async nearestNeighborOptimization(
    start: Location,
    locations: Location[]
  ): Promise<Location[]> {
    const unvisited = [...locations];
    const route: Location[] = [];
    let current = start;

    while (unvisited.length > 0) {
      // Find nearest unvisited location
      let nearestIndex = 0;
      let minDistance = Infinity;

      for (let i = 0; i < unvisited.length; i++) {
        const distance = this.calculateHaversineDistance(
          current.latitude,
          current.longitude,
          unvisited[i].latitude,
          unvisited[i].longitude
        );

        if (distance < minDistance) {
          minDistance = distance;
          nearestIndex = i;
        }
      }

      // Add nearest to route and remove from unvisited
      const nearest = unvisited[nearestIndex];
      route.push(nearest);
      current = nearest;
      unvisited.splice(nearestIndex, 1);
    }

    return route;
  }

  /**
   * Calculate distance between two points using Haversine formula
   */
  private calculateHaversineDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371000; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  /**
   * Get detailed route information using Google Maps Directions API
   */
  private async getDetailedRoute(
    start: Location,
    stops: Location[]
  ): Promise<{
    stops: RouteStop[];
    totalDistance: number;
    totalDuration: number;
  }> {
    if (!this.GOOGLE_MAPS_API_KEY) {
      // Fallback to simple calculation if no API key
      return this.calculateSimpleRoute(start, stops);
    }

    try {
      // Build waypoints string for Google Maps API
      const waypoints = stops
        .slice(0, -1)
        .map((loc) => `${loc.latitude},${loc.longitude}`)
        .join('|');

      const origin = `${start.latitude},${start.longitude}`;
      const destination = `${stops[stops.length - 1].latitude},${stops[stops.length - 1].longitude}`;

      const response = await axios.get(
        'https://maps.googleapis.com/maps/api/directions/json',
        {
          params: {
            origin,
            destination,
            waypoints,
            optimize: false, // We already optimized
            departure_time: 'now',
            traffic_model: 'best_guess',
            key: this.GOOGLE_MAPS_API_KEY,
          },
          timeout: 10000,
        }
      );

      if (response.data.status !== 'OK') {
        console.error('Google Maps API error:', response.data.status);
        return this.calculateSimpleRoute(start, stops);
      }

      const route = response.data.routes[0];
      const legs = route.legs;

      let currentTime = new Date();
      let cumulativeDistance = 0;
      let cumulativeDuration = 0;

      const routeStops: RouteStop[] = stops.map((location, index) => {
        const leg = legs[index];

        const distance = leg.distance.value; // meters
        const duration = leg.duration_in_traffic?.value || leg.duration.value; // seconds

        cumulativeDistance += distance;
        cumulativeDuration += duration;

        const estimatedArrival = new Date(currentTime.getTime() + duration * 1000);
        currentTime = estimatedArrival;

        return {
          location,
          orderId: location.orderId,
          sequenceNumber: index + 1,
          estimatedArrival,
          distance,
          duration,
        };
      });

      return {
        stops: routeStops,
        totalDistance: cumulativeDistance,
        totalDuration: cumulativeDuration,
      };
    } catch (error) {
      console.error('Error fetching route from Google Maps:', error);
      return this.calculateSimpleRoute(start, stops);
    }
  }

  /**
   * Fallback simple route calculation
   */
  private calculateSimpleRoute(
    start: Location,
    stops: Location[]
  ): {
    stops: RouteStop[];
    totalDistance: number;
    totalDuration: number;
  } {
    let current = start;
    let currentTime = new Date();
    let totalDistance = 0;
    let totalDuration = 0;

    const routeStops: RouteStop[] = stops.map((location, index) => {
      const distance = this.calculateHaversineDistance(
        current.latitude,
        current.longitude,
        location.latitude,
        location.longitude
      );

      // Estimate duration: 30 km/h average speed in city
      const duration = (distance / 30000) * 3600; // seconds

      totalDistance += distance;
      totalDuration += duration;

      const estimatedArrival = new Date(currentTime.getTime() + duration * 1000);

      current = location;
      currentTime = estimatedArrival;

      return {
        location,
        orderId: location.orderId,
        sequenceNumber: index + 1,
        estimatedArrival,
        distance,
        duration,
      };
    });

    return {
      stops: routeStops,
      totalDistance,
      totalDuration,
    };
  }

  /**
   * Real-time rerouting based on traffic conditions
   */
  async rerouteBasedOnTraffic(
    currentRoute: OptimizedRoute,
    currentLocation: Location,
    currentStopIndex: number
  ): Promise<OptimizedRoute> {
    // Get remaining stops
    const remainingStops = currentRoute.stops
      .slice(currentStopIndex)
      .map((stop) => stop.location);

    if (remainingStops.length === 0) {
      return currentRoute;
    }

    // Check traffic conditions
    const trafficData = await this.getTrafficConditions(
      currentLocation,
      remainingStops[0]
    );

    // If traffic is severe, try alternative route
    if (trafficData.level === 'severe' || trafficData.level === 'high') {
      console.log(`High traffic detected, rerouting...`);

      // Re-optimize remaining route
      const newRoute = await this.optimizeRoute(
        currentRoute.driverId,
        currentLocation,
        remainingStops
      );

      // Combine completed stops with new route
      const completedStops = currentRoute.stops.slice(0, currentStopIndex);

      return {
        ...newRoute,
        stops: [...completedStops, ...newRoute.stops],
      };
    }

    return currentRoute;
  }

  /**
   * Get traffic conditions between two points
   */
  private async getTrafficConditions(
    from: Location,
    to: Location
  ): Promise<TrafficData> {
    const cacheKey = `traffic:${from.latitude.toFixed(3)}:${from.longitude.toFixed(3)}:${to.latitude.toFixed(3)}:${to.longitude.toFixed(3)}`;

    // Check cache
    const cached = await this.redisClient.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    if (!this.GOOGLE_MAPS_API_KEY) {
      // Default to low traffic if no API
      return { level: 'low', delayMinutes: 0 };
    }

    try {
      const response = await axios.get(
        'https://maps.googleapis.com/maps/api/directions/json',
        {
          params: {
            origin: `${from.latitude},${from.longitude}`,
            destination: `${to.latitude},${to.longitude}`,
            departure_time: 'now',
            traffic_model: 'best_guess',
            key: this.GOOGLE_MAPS_API_KEY,
          },
          timeout: 5000,
        }
      );

      if (response.data.status !== 'OK') {
        return { level: 'low', delayMinutes: 0 };
      }

      const leg = response.data.routes[0].legs[0];
      const normalDuration = leg.duration.value; // seconds
      const trafficDuration = leg.duration_in_traffic?.value || normalDuration;

      const delaySeconds = trafficDuration - normalDuration;
      const delayMinutes = Math.round(delaySeconds / 60);

      let level: TrafficData['level'] = 'low';

      if (delayMinutes > 15) {
        level = 'severe';
      } else if (delayMinutes > 10) {
        level = 'high';
      } else if (delayMinutes > 5) {
        level = 'medium';
      }

      const trafficData: TrafficData = { level, delayMinutes };

      // Cache for 5 minutes
      await this.redisClient.setEx(cacheKey, 300, JSON.stringify(trafficData));

      return trafficData;
    } catch (error) {
      console.error('Traffic API error:', error);
      return { level: 'low', delayMinutes: 0 };
    }
  }

  /**
   * Batch optimize routes for multiple drivers
   */
  async batchOptimizeRoutes(
    deliveries: Array<{
      driverId: string;
      startLocation: Location;
      deliveryLocations: Location[];
    }>
  ): Promise<OptimizedRoute[]> {
    const optimizationPromises = deliveries.map((delivery) =>
      this.optimizeRoute(
        delivery.driverId,
        delivery.startLocation,
        delivery.deliveryLocations
      )
    );

    return Promise.all(optimizationPromises);
  }

  /**
   * Get ETA for a specific stop in route
   */
  getStopETA(route: OptimizedRoute, stopIndex: number): Date | null {
    if (stopIndex < 0 || stopIndex >= route.stops.length) {
      return null;
    }

    return route.stops[stopIndex].estimatedArrival;
  }
}

export default new RouteOptimizerService();
