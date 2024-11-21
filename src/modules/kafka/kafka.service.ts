import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Kafka, Producer } from 'kafkajs';
import { env } from 'src/config';

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  private kafka: Kafka;
  private producer: Producer;

  constructor() {
    this.kafka = new Kafka({
      clientId: 'nestjs-producer',
      brokers: [env.kafka.broker],
    });
    this.producer = this.kafka.producer();
  }

  async onModuleInit() {
    await this.producer.connect();
    console.log('Kafka Producer connected');
  }

  async onModuleDestroy() {
    await this.producer.disconnect();
    console.log('Kafka Producer disconnected');
  }

  async sendMessage(topic: string, message: string | object): Promise<void> {
    const value =
      typeof message === 'string' ? message : JSON.stringify(message);

    await this.producer.send({
      topic,
      messages: [{ value }],
    });

    console.log(`Message sent to topic "${topic}": ${value}`);
  }
}
