import { Kafka } from 'kafkajs';

export const kafka = new Kafka({
  clientId: 'user-app',
  brokers: ['localhost:9092'],
});
