import { MongoClient } from 'mongodb';
import { logger } from '@delivery/shared';

export const mongoClient = new MongoClient(process.env.MONGODB_URL || 'mongodb://localhost:27017');

export const connectMongo = async () => {
  try {
    await mongoClient.connect();
    logger.info('Tracking Service: MongoDB connected');

    // Create geospatial index
    const db = mongoClient.db('delivery_platform');
    await db.collection('location_history').createIndex({ location: '2dsphere' });
  } catch (error) {
    logger.error('Tracking Service: MongoDB connection failed', error);
    throw error;
  }
};
