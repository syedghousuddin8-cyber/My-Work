import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { pool } from './config/database';
import { connectRedis } from './config/redis';
import { connectKafka } from './config/kafka';
import paymentRoutes from './routes/payment.routes';
import webhookRoutes from './routes/webhook.routes';
import { logger } from '@delivery/shared';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3005;

// Middleware
app.use(helmet());
app.use(cors());

// Webhook routes BEFORE body parsing (needs raw body)
app.use('/api/v1/webhooks', webhookRoutes);

// Body parsing for regular routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/v1/payments', paymentRoutes);

// Health check
app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'healthy', service: 'payment-service' });
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

    // Start server
    app.listen(PORT, () => {
      logger.info(`Payment Service running on port ${PORT}`);
      logger.info(`Webhook endpoint: http://localhost:${PORT}/api/v1/webhooks/stripe`);
    });
  } catch (error) {
    logger.error('Failed to start Payment Service:', error);
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
