import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import { verifyToken } from '@delivery/shared';
import { logger } from '@delivery/shared';
import { redisClient } from '../config/redis';

let io: Server;

export const initializeWebSocket = (server: HttpServer) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CORS_ORIGINS?.split(',') || '*',
      credentials: true,
    },
  });

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      const decoded = verifyToken(token);
      (socket as any).user = decoded;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    const user = (socket as any).user;
    logger.info(`WebSocket connected: ${user.userId}`);

    // Join user to their room for targeted updates
    socket.join(`user:${user.userId}`);

    socket.on('join:order', (orderId: string) => {
      socket.join(`order:${orderId}`);
      logger.info(`User ${user.userId} joined order room: ${orderId}`);
    });

    socket.on('leave:order', (orderId: string) => {
      socket.leave(`order:${orderId}`);
    });

    socket.on('disconnect', () => {
      logger.info(`WebSocket disconnected: ${user.userId}`);
    });
  });

  // Subscribe to Redis pub/sub for order updates
  const subscriber = redisClient.duplicate();
  subscriber.connect().then(() => {
    subscriber.subscribe('order:updates', (message) => {
      const update = JSON.parse(message);
      io.to(`order:${update.orderId}`).emit('order:update', update);
    });
  });

  logger.info('WebSocket server initialized');
};

export const sendOrderUpdate = async (orderId: string, update: any) => {
  // Publish to Redis for distribution across instances
  await redisClient.publish('order:updates', JSON.stringify({ orderId, ...update }));
};

export { io };
