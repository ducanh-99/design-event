import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientKafka } from '@nestjs/microservices';
import { Booking } from './entities/booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { KafkaTopics } from '../constant';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async createBooking(createBookingDto: CreateBookingDto) {
    // Produce message to Kafka for booking request
    const message = JSON.stringify(createBookingDto);
    await this.kafkaClient.emit(KafkaTopics.bookingRequests, message);
  }

  async handleBookingRequest(createBookingDto: CreateBookingDto) {
    const { eventId, quantity } = createBookingDto;

    const availableTickets = await this.getAvailableTickets(eventId); // Implement logic to fetch available tickets

    if (availableTickets >= quantity) {
      const message = JSON.stringify({
        status: 'CONFIRMED',
        ...createBookingDto,
      });
      await this.kafkaClient.emit(KafkaTopics.bookingResults, message);
    } else {
      const message = JSON.stringify({ status: 'FAILED', ...createBookingDto });
      await this.kafkaClient.emit(KafkaTopics.bookingResults, message);
    }
  }

  async handleBookingResult(result: any) {
    const { userId, eventId, quantity, status } = result;

    if (status === 'CONFIRMED') {
      // Deduct tickets in database
      await this.updateAvailableTickets(eventId, -quantity);
      await this.bookingRepository.save({ userId, eventId, quantity, status });
    } else {
      // Handle failed bookings
      await this.bookingRepository.save({ userId, eventId, quantity, status });
    }
  }

  private async getAvailableTickets(eventId: number): Promise<number> {
    // Mock: Fetch remaining tickets for the event
    const remainTicket = await this.redis.hget('events', eventId.toString());

    if (remainTicket) {
      return parseInt(remainTicket);
    } else {
      return 0;
    }
  }

  private async updateAvailableTickets(eventId: number, change: number) {
    // Mock: Update available tickets in the database
    await this.redis.hincrby('events', eventId.toString(), change);
  }
}
