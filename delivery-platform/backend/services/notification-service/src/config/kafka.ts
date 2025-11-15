import { Kafka } from 'kafkajs';
import { logger } from '@delivery/shared';

export const kafka = new Kafka({
  clientId: 'notification-service',
  brokers: process.env.KAFKA_BROKERS?.split(',') || ['localhost:9092'],
});

export const producer = kafka.producer();
export const consumer = kafka.consumer({ groupId: 'notification-service-group' });

export const connectKafka = async () => {
  try {
    await producer.connect();
    await consumer.connect();
    logger.info('Notification Service: Kafka connected');
  } catch (error) {
    logger.error('Notification Service: Kafka connection failed', error);
    throw error;
  }
};
