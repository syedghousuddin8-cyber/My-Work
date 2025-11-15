import { RedisClient } from '../config/redis';
import { DatabaseClient } from '../config/database';
import axios from 'axios';

interface PricingParams {
  vendorId: string;
  customerId: string;
  distance: number; // in kilometers
  orderValue: number;
  latitude: number;
  longitude: number;
  scheduledTime?: Date;
}

interface PricingResult {
  baseFee: number;
  distanceFee: number;
  surgeFee: number;
  weatherAdjustment: number;
  totalDeliveryFee: number;
  surgeMultiplier: number;
  breakdown: {
    baseFee: number;
    distanceFee: number;
    surgeFee: number;
    weatherAdjustment: number;
  };
}

interface SurgeData {
  multiplier: number;
  activeOrders: number;
  availableDrivers: number;
  reason: string;
}

export class PricingService {
  private redisClient = RedisClient.getInstance();
  private dbClient = DatabaseClient.getInstance();

  // Base configuration
  private readonly BASE_FEE = 5.0;
  private readonly FEE_PER_KM = 1.5;
  private readonly MAX_SURGE_MULTIPLIER = 3.0;
  private readonly MIN_SURGE_MULTIPLIER = 1.0;

  /**
   * Calculate dynamic pricing for an order
   */
  async calculatePrice(params: PricingParams): Promise<PricingResult> {
    const { distance, orderValue, latitude, longitude, scheduledTime } = params;

    // Get base fees from settings
    const settings = await this.getSettings();
    const baseFee = settings.deliveryBaseFee || this.BASE_FEE;
    const feePerKm = settings.deliveryFeePerKm || this.FEE_PER_KM;

    // Calculate distance-based fee
    const distanceFee = this.calculateDistanceFee(distance, feePerKm);

    // Calculate surge multiplier
    const surgeData = await this.calculateSurgeMultiplier(
      latitude,
      longitude,
      scheduledTime || new Date()
    );

    // Calculate weather adjustment
    const weatherAdjustment = await this.calculateWeatherAdjustment(
      latitude,
      longitude
    );

    // Calculate surge fee
    const baseTotal = baseFee + distanceFee;
    const surgeFee = baseTotal * (surgeData.multiplier - 1);

    // Calculate final total
    const totalDeliveryFee = baseTotal + surgeFee + weatherAdjustment;

    return {
      baseFee,
      distanceFee,
      surgeFee,
      weatherAdjustment,
      totalDeliveryFee: Math.round(totalDeliveryFee * 100) / 100,
      surgeMultiplier: surgeData.multiplier,
      breakdown: {
        baseFee,
        distanceFee,
        surgeFee,
        weatherAdjustment,
      },
    };
  }

  /**
   * Calculate distance-based delivery fee
   */
  private calculateDistanceFee(distance: number, feePerKm: number): number {
    // First 2km is free, then charge per km
    const chargeableDistance = Math.max(0, distance - 2);
    return Math.round(chargeableDistance * feePerKm * 100) / 100;
  }

  /**
   * Calculate surge multiplier based on demand and supply
   */
  async calculateSurgeMultiplier(
    latitude: number,
    longitude: number,
    requestedTime: Date
  ): Promise<SurgeData> {
    const cacheKey = `surge:${latitude.toFixed(2)}:${longitude.toFixed(2)}`;

    // Check cache first (TTL: 5 minutes)
    const cached = await this.redisClient.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    // Get active orders in the area (within 5km radius)
    const activeOrders = await this.getActiveOrdersInArea(latitude, longitude, 5);

    // Get available drivers in the area
    const availableDrivers = await this.getAvailableDriversInArea(latitude, longitude, 5);

    // Calculate demand/supply ratio
    const demandSupplyRatio = availableDrivers > 0
      ? activeOrders / availableDrivers
      : activeOrders;

    // Base surge multiplier on ratio
    let multiplier = this.MIN_SURGE_MULTIPLIER;
    let reason = 'Normal demand';

    if (demandSupplyRatio > 5) {
      multiplier = this.MAX_SURGE_MULTIPLIER;
      reason = 'Very high demand';
    } else if (demandSupplyRatio > 3) {
      multiplier = 2.5;
      reason = 'High demand';
    } else if (demandSupplyRatio > 2) {
      multiplier = 2.0;
      reason = 'Moderate demand';
    } else if (demandSupplyRatio > 1) {
      multiplier = 1.5;
      reason = 'Slightly elevated demand';
    }

    // Apply peak hours multiplier
    const hour = requestedTime.getHours();
    const isPeakHour = this.isPeakHour(hour);
    if (isPeakHour && multiplier < 2.0) {
      multiplier = Math.max(multiplier, 1.5);
      reason += ' (peak hours)';
    }

    const surgeData: SurgeData = {
      multiplier,
      activeOrders,
      availableDrivers,
      reason,
    };

    // Cache for 5 minutes
    await this.redisClient.setEx(cacheKey, 300, JSON.stringify(surgeData));

    return surgeData;
  }

  /**
   * Check if hour is peak hour (lunch: 11-14, dinner: 18-21)
   */
  private isPeakHour(hour: number): boolean {
    return (hour >= 11 && hour <= 14) || (hour >= 18 && hour <= 21);
  }

  /**
   * Calculate weather-based adjustment
   */
  async calculateWeatherAdjustment(
    latitude: number,
    longitude: number
  ): Promise<number> {
    try {
      const weatherApiKey = process.env.WEATHER_API_KEY;
      if (!weatherApiKey) {
        return 0;
      }

      const cacheKey = `weather:${latitude.toFixed(2)}:${longitude.toFixed(2)}`;
      const cached = await this.redisClient.get(cacheKey);

      if (cached) {
        return parseFloat(cached);
      }

      // Call weather API (OpenWeatherMap example)
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather`,
        {
          params: {
            lat: latitude,
            lon: longitude,
            appid: weatherApiKey,
          },
          timeout: 3000,
        }
      );

      const weather = response.data.weather[0].main.toLowerCase();
      const windSpeed = response.data.wind.speed; // m/s

      let adjustment = 0;

      // Weather conditions adjustment
      if (weather.includes('rain') || weather.includes('drizzle')) {
        adjustment += 2.0;
      } else if (weather.includes('snow') || weather.includes('thunderstorm')) {
        adjustment += 3.0;
      } else if (weather.includes('fog') || weather.includes('mist')) {
        adjustment += 1.5;
      }

      // Wind adjustment
      if (windSpeed > 15) {
        adjustment += 1.0;
      } else if (windSpeed > 10) {
        adjustment += 0.5;
      }

      // Cache for 30 minutes
      await this.redisClient.setEx(cacheKey, 1800, adjustment.toString());

      return adjustment;
    } catch (error) {
      console.error('Weather API error:', error);
      return 0; // Default to no adjustment on error
    }
  }

  /**
   * Get active orders in area from database
   */
  private async getActiveOrdersInArea(
    latitude: number,
    longitude: number,
    radiusKm: number
  ): Promise<number> {
    const query = `
      SELECT COUNT(*) as count
      FROM orders
      WHERE status IN ('new', 'confirmed', 'preparing', 'picked_up', 'in_transit')
      AND ST_DWithin(
        delivery_location::geography,
        ST_MakePoint($1, $2)::geography,
        $3
      )
    `;

    const result = await this.dbClient.query(query, [
      longitude,
      latitude,
      radiusKm * 1000, // Convert to meters
    ]);

    return parseInt(result.rows[0].count, 10);
  }

  /**
   * Get available drivers in area from Redis
   */
  private async getAvailableDriversInArea(
    latitude: number,
    longitude: number,
    radiusKm: number
  ): Promise<number> {
    try {
      // Get nearby drivers using Redis GEO commands
      const drivers = await this.redisClient.geoRadius(
        'drivers:online',
        { longitude, latitude },
        radiusKm,
        'km'
      );

      return drivers ? drivers.length : 0;
    } catch (error) {
      console.error('Redis GEO error:', error);
      return 0;
    }
  }

  /**
   * Get platform settings
   */
  private async getSettings(): Promise<any> {
    const cached = await this.redisClient.get('platform:settings');

    if (cached) {
      return JSON.parse(cached);
    }

    const result = await this.dbClient.query(
      'SELECT * FROM platform_settings LIMIT 1'
    );

    const settings = result.rows[0] || {};

    await this.redisClient.setEx('platform:settings', 3600, JSON.stringify(settings));

    return settings;
  }

  /**
   * Get pricing estimate without storing
   */
  async getEstimate(params: PricingParams): Promise<PricingResult> {
    return this.calculatePrice(params);
  }

  /**
   * Store pricing for an order
   */
  async storePricing(orderId: string, pricing: PricingResult): Promise<void> {
    const query = `
      INSERT INTO order_pricing (
        order_id, base_fee, distance_fee, surge_fee,
        weather_adjustment, total_delivery_fee, surge_multiplier,
        created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
    `;

    await this.dbClient.query(query, [
      orderId,
      pricing.baseFee,
      pricing.distanceFee,
      pricing.surgeFee,
      pricing.weatherAdjustment,
      pricing.totalDeliveryFee,
      pricing.surgeMultiplier,
    ]);
  }

  /**
   * Get current surge areas
   */
  async getSurgeAreas(): Promise<Array<{
    latitude: number;
    longitude: number;
    multiplier: number;
    reason: string;
  }>> {
    // Get all surge cache keys
    const keys = await this.redisClient.keys('surge:*');

    const surgeAreas = [];

    for (const key of keys) {
      const data = await this.redisClient.get(key);
      if (data) {
        const parsed = JSON.parse(data);
        const [, lat, lng] = key.split(':');

        surgeAreas.push({
          latitude: parseFloat(lat),
          longitude: parseFloat(lng),
          multiplier: parsed.multiplier,
          reason: parsed.reason,
        });
      }
    }

    return surgeAreas;
  }
}

export default new PricingService();
