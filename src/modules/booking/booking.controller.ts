import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Controller()
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @MessagePattern('createBooking')
  booking(@Payload() createBookingDto: CreateBookingDto) {
    return this.bookingService.booking(createBookingDto);
  }
}
