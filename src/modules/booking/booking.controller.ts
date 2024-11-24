import { Controller, Logger } from '@nestjs/common';
import { BookingService } from './booking.service';
import { MessagePattern } from '@nestjs/microservices';
import { KafkaTopics } from '../constant';

@Controller()
export class BookingController {
  private readonly logger = new Logger(BookingController.name);
  constructor(private readonly bookingService: BookingService) {}
  async onModuleInit() {
    this.logger.log('Booking Controller Initialized');
  }

  @MessagePattern(KafkaTopics.bookingResults)
  async consumeBookingResult(message: any) {
    this.logger.log(`Received message booking result: ${message}`);
    this.bookingService.handleBookingResult(message);
  }

  @MessagePattern(KafkaTopics.bookingRequests)
  async consumeBookingRequest(message: any) {
    this.logger.log(`Received message booking requests: ${message}`);
    this.bookingService.handleBookingRequest(message);
  }
}
