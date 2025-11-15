import { createClient, RedisClientType } from 'redis';

export class RedisClient {
  private static instance: RedisClientType;

  static getInstance(): RedisClientType {
    if (!this.instance) {
      this.instance = createClient({
        url: process.env.REDIS_URL || 'redis://localhost:6379',
      });

      this.instance.on('error', (err) => console.error('Redis Client Error', err));
      this.instance.on('connect', () => console.log('Redis Client Connected'));

      this.instance.connect().catch(console.error);
    }

    return this.instance;
  }
}
