import { Kafka } from 'kafkajs';
import { logger } from '@delivery/shared';

export const kafka = new Kafka({
  clientId: 'vendor-service',
  brokers: process.env.KAFKA_BROKERS?.split(',') || ['localhost:9092'],
});

export const producer = kafka.producer();

export const connectKafka = async () => {
  try {
    await producer.connect();
    logger.info('Vendor Service: Kafka connected');
  } catch (error) {
    logger.error('Vendor Service: Kafka connection failed', error);
    throw error;
  }
};

export const publishEvent = async (topic: string, message: any) => {
  try {
    await producer.send({
      topic,
      messages: [
        {
          key: message.vendorId || message.id,
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
