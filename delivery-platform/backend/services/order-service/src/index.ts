import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { logger } from '@delivery/shared';
import { pool, connectDatabase } from './config/database';
import { kafka, connectKafka, disconnectKafka } from './config/kafka';
import { redisClient, connectRedis } from './config/redis';
import orderRoutes from './routes/order.routes';
import { errorHandler } from './middleware/error.middleware';
import { initializeWebSocket } from './services/websocket.service';
import http from 'http';

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3002;

// Middleware
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGINS?.split(',') || '*' }));
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'order-service' });
});

// Routes
app.use('/api/v1/orders', orderRoutes);
app.use(errorHandler);

// Initialize WebSocket for real-time updates
initializeWebSocket(server);

// Graceful shutdown
const shutdown = async () => {
  await pool.end();
  await disconnectKafka();
  await redisClient.quit();
  process.exit(0);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

// Start server
const start = async () => {
  try {
    await connectDatabase();
    await connectKafka();
    await connectRedis();

    server.listen(PORT, () => {
      logger.info(`Order Service running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start:', error);
    process.exit(1);
  }
};

start();
