import express from 'express';
import { logger } from '@delivery/shared';
import { connectKafka, consumer } from './config/kafka';
import { NotificationService } from './services/notification.service';

const app = express();
const PORT = process.env.PORT || 3006;
const notificationService = new NotificationService();

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'notification-service' });
});

// Manual notification endpoint (for testing)
app.post('/send', async (req, res) => {
  try {
    const { type, userId, data } = req.body;
    await notificationService.sendNotification(type, userId, data);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start Kafka consumer
const startConsumer = async () => {
  await consumer.subscribe({
    topics: ['notification.send', 'order.created', 'order.confirmed', 'order.delivered'],
    fromBeginning: false
  });

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      const data = JSON.parse(message.value?.toString() || '{}');

      switch (topic) {
        case 'notification.send':
          await notificationService.sendNotification(data.type, data.userId, data.data);
          break;
        case 'order.created':
          await notificationService.sendOrderCreatedNotifications(data);
          break;
        case 'order.confirmed':
          await notificationService.sendOrderConfirmedNotifications(data);
          break;
        case 'order.delivered':
          await notificationService.sendOrderDeliveredNotifications(data);
          break;
      }
    },
  });
};

const start = async () => {
  try {
    await connectKafka();
    await startConsumer();

    app.listen(PORT, () => {
      logger.info(`Notification Service running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start Notification Service:', error);
    process.exit(1);
  }
};

start();
