import { Injectable } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';

class Kafka {
  send(topic: string, message: any) {
    return 'This action adds a new booking';
  }
}

@Injectable()
export class BookingService {
  kafka: any;
  constructor() {
    this.kafka = new Kafka();
  }
  booking(createBookingDto: CreateBookingDto) {
    this.kafka.send('createBooking', createBookingDto);
    return 'This action adds a new booking';
  }
}
