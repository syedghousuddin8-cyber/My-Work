import { Kafka } from 'kafkajs';
import { logger } from '@delivery/shared';

export const kafka = new Kafka({
  clientId: 'payment-service',
  brokers: process.env.KAFKA_BROKERS?.split(',') || ['localhost:9092'],
});

export const producer = kafka.producer();
export const consumer = kafka.consumer({ groupId: 'payment-service-group' });

export const connectKafka = async () => {
  try {
    await producer.connect();
    await consumer.connect();
    logger.info('Payment Service: Kafka connected');

    // Subscribe to order events
    await consumer.subscribe({ topics: ['order.created', 'order.delivered', 'order.cancelled'], fromBeginning: false });

    // Start consuming
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const data = JSON.parse(message.value?.toString() || '{}');
        logger.info(`Received event from ${topic}:`, data);

        // Payment events are handled in PaymentService
      },
    });
  } catch (error) {
    logger.error('Payment Service: Kafka connection failed', error);
    throw error;
  }
};

export const publishEvent = async (topic: string, message: any) => {
  try {
    await producer.send({
      topic,
      messages: [
        {
          key: message.paymentId || message.id,
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
