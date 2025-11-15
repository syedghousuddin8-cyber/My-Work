import { createClient } from 'redis';
import { logger } from '@delivery/shared';

export const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

export const connectRedis = async () => {
  try {
    await redisClient.connect();
    logger.info('Tracking Service: Redis connected');
  } catch (error) {
    logger.error('Tracking Service: Redis connection failed', error);
    throw error;
  }
};
