import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { pool } from './config/database';
import { connectRedis } from './config/redis';
import { connectKafka } from './config/kafka';
import { connectMongoDB } from './config/mongodb';
import driverRoutes from './routes/driver.routes';
import { logger } from '@delivery/shared';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3004;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/v1/drivers', driverRoutes);

// Health check
app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'healthy', service: 'driver-service' });
  } catch (error) {
    res.status(503).json({ status: 'unhealthy', error: error.message });
  }
});

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Initialize services and start server
const startServer = async () => {
  try {
    // Connect to PostgreSQL
    await pool.query('SELECT NOW()');
    logger.info('PostgreSQL connected');

    // Connect to Redis
    await connectRedis();

    // Connect to MongoDB
    await connectMongoDB();

    // Connect to Kafka
    await connectKafka();

    // Start server
    app.listen(PORT, () => {
      logger.info(`Driver Service running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start Driver Service:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully...');
  process.exit(0);
});

startServer();
