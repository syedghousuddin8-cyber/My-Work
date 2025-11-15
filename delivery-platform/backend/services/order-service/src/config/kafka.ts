import { Kafka, Producer, Consumer } from 'kafkajs';
import { logger } from '@delivery/shared';

const kafka = new Kafka({
  clientId: 'order-service',
  brokers: process.env.KAFKA_BROKERS?.split(',') || ['localhost:9092'],
});

export const producer: Producer = kafka.producer();
export const consumer: Consumer = kafka.consumer({ groupId: 'order-service-group' });

export const connectKafka = async () => {
  try {
    await producer.connect();
    await consumer.connect();
    await consumer.subscribe({ topics: ['payment.completed', 'driver.assigned'], fromBeginning: false });

    // Start consuming messages
    consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const value = message.value?.toString();
        logger.info(`Received message from ${topic}:`, value);

        // Handle different event types
        if (topic === 'payment.completed') {
          // Update order status after payment
          const paymentData = JSON.parse(value || '{}');
          await handlePaymentCompleted(paymentData);
        } else if (topic === 'driver.assigned') {
          // Update order with driver info
          const driverData = JSON.parse(value || '{}');
          await handleDriverAssigned(driverData);
        }
      },
    });

    logger.info('Order Service: Kafka connected');
  } catch (error) {
    logger.error('Order Service: Kafka connection failed', error);
    throw error;
  }
};

export const disconnectKafka = async () => {
  await producer.disconnect();
  await consumer.disconnect();
};

export const publishEvent = async (topic: string, message: any) => {
  await producer.send({
    topic,
    messages: [{ value: JSON.stringify(message) }],
  });
};

// Event handlers
const handlePaymentCompleted = async (data: any) => {
  // Update order status to confirmed
  logger.info('Payment completed for order:', data.orderId);
};

const handleDriverAssigned = async (data: any) => {
  // Update order with driver information
  logger.info('Driver assigned to order:', data.orderId);
};

export { kafka };
