import { Injectable } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookingService {
  kafka: any;
  constructor() {}
  booking(createBookingDto: CreateBookingDto) {
    this.kafka.send('createBooking', createBookingDto);
    return 'This action adds a new booking';
  }
}
