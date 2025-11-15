import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { logger, verifyToken } from '@delivery/shared';
import { redisClient, connectRedis } from './config/redis';
import { mongoClient, connectMongo } from './config/mongodb';
import { kafka, producer, connectKafka } from './config/kafka';
import { TrackingService } from './services/tracking.service';
import { ETAService } from './services/eta.service';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*', credentials: true }
});

const PORT = process.env.PORT || 3007;
const trackingService = new TrackingService();
const etaService = new ETAService();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'tracking-service' });
});

// WebSocket authentication
io.use((socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    const decoded = verifyToken(token);
    (socket as any).user = decoded;
    next();
  } catch (error) {
    next(new Error('Authentication failed'));
  }
});

// WebSocket connection handling
io.on('connection', (socket) => {
  const user = (socket as any).user;
  logger.info(`Tracking WS connected: ${user.userId} (${user.role})`);

  // Driver location updates
  if (user.role === 'driver') {
    socket.on('location:update', async (data: { latitude: number; longitude: number; orderId?: string }) => {
      try {
        await trackingService.updateDriverLocation(user.userId, data);

        // If driver has active order, send updates to customer
        if (data.orderId) {
          const eta = await etaService.calculateETA(user.userId, data.orderId);
          io.to(`order:${data.orderId}`).emit('driver:location', {
            driverId: user.userId,
            location: data,
            eta
          });
        }
      } catch (error) {
        logger.error('Location update error:', error);
      }
    });
  }

  // Subscribe to order tracking
  socket.on('track:order', (orderId: string) => {
    socket.join(`order:${orderId}`);
    logger.info(`User ${user.userId} tracking order: ${orderId}`);
  });

  socket.on('untrack:order', (orderId: string) => {
    socket.leave(`order:${orderId}`);
  });

  socket.on('disconnect', () => {
    logger.info(`Tracking WS disconnected: ${user.userId}`);
  });
});

// Start server
const start = async () => {
  try {
    await connectRedis();
    await connectMongo();
    await connectKafka();

    server.listen(PORT, () => {
      logger.info(`Tracking Service running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start Tracking Service:', error);
    process.exit(1);
  }
};

start();

export { io };
