import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { pool } from './config/database';
import { connectRedis } from './config/redis';
import { connectKafka } from './config/kafka';
import { initializeElasticsearch } from './config/elasticsearch';
import vendorRoutes from './routes/vendor.routes';
import { logger } from '@delivery/shared';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3003;

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
app.use('/api/v1/vendors', vendorRoutes);

// Health check
app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'healthy', service: 'vendor-service' });
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

    // Connect to Kafka
    await connectKafka();

    // Initialize Elasticsearch
    await initializeElasticsearch();

    // Start server
    app.listen(PORT, () => {
      logger.info(`Vendor Service running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start Vendor Service:', error);
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
