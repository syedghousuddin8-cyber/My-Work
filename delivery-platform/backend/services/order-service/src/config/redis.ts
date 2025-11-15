import { createClient } from 'redis';
import { logger } from '@delivery/shared';

export const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

export const connectRedis = async () => {
  try {
    await redisClient.connect();
    logger.info('Order Service: Redis connected');
  } catch (error) {
    logger.error('Order Service: Redis connection failed', error);
    throw error;
  }
};

redisClient.on('error', (err) => logger.error('Redis error:', err));
