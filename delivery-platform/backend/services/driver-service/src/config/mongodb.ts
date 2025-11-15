import { MongoClient, Db } from 'mongodb';
import { logger } from '@delivery/shared';

let db: Db;

export const connectMongoDB = async () => {
  try {
    const client = await MongoClient.connect(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/delivery_platform'
    );

    db = client.db();

    // Create indexes
    await db.collection('driver_earnings').createIndex({ driverId: 1, date: -1 });
    await db.collection('driver_shifts').createIndex({ driverId: 1, startTime: -1 });

    logger.info('MongoDB connected');
    return db;
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    throw error;
  }
};

export const getDB = () => {
  if (!db) {
    throw new Error('Database not initialized');
  }
  return db;
};
