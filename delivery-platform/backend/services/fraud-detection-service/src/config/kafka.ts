import { Kafka, Producer } from 'kafkajs';

export class KafkaProducer {
  private static instance: Producer;
  private static kafka: Kafka;

  static getInstance(): Producer {
    if (!this.instance) {
      this.kafka = new Kafka({
        clientId: 'fraud-detection-service',
        brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
      });

      this.instance = this.kafka.producer();

      this.instance.connect().then(() => {
        console.log('Kafka Producer connected');
      }).catch(console.error);
    }

    return this.instance;
  }
}
