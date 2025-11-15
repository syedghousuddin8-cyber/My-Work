import { Kafka } from 'kafkajs';
import { logger } from '@delivery/shared';

export const kafka = new Kafka({
  clientId: 'driver-service',
  brokers: process.env.KAFKA_BROKERS?.split(',') || ['localhost:9092'],
});

export const producer = kafka.producer();
export const consumer = kafka.consumer({ groupId: 'driver-service-group' });

export const connectKafka = async () => {
  try {
    await producer.connect();
    await consumer.connect();
    logger.info('Driver Service: Kafka connected');

    // Subscribe to relevant topics
    await consumer.subscribe({ topics: ['order.created', 'order.completed', 'order.cancelled'], fromBeginning: false });

    // Start consuming
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const data = JSON.parse(message.value?.toString() || '{}');
        logger.info(`Received event from ${topic}:`, data);

        // Handle events
        if (topic === 'order.completed' || topic === 'order.cancelled') {
          // Update driver availability
          if (data.driverId) {
            await redisClient.set(`driver:${data.driverId}:current_order`, '');
          }
        }
      },
    });
  } catch (error) {
    logger.error('Driver Service: Kafka connection failed', error);
    throw error;
  }
};

export const publishEvent = async (topic: string, message: any) => {
  try {
    await producer.send({
      topic,
      messages: [
        {
          key: message.driverId || message.id,
          value: JSON.stringify(message),
          timestamp: Date.now().toString(),
        },
      ],
    });
    logger.debug(`Event published to ${topic}`, message);
  } catch (error) {
    logger.error(`Failed to publish event to ${topic}`, error);
    throw error;
  }
};
