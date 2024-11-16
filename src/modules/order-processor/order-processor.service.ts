/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { CreateBookingDto } from '../booking/dto/create-booking.dto';
import { Booking } from '../booking/entities/booking.entity';

class Kafka {
  send(topic: string, message: CreateBookingDto) {
    return 'This action adds a new booking';
  }
}

class BookingRepository {
  updateStatus(bookingId: string, status: string) {
    return 'This action updates the booking status';
  }
}

@Injectable()
export class OrderProcessorService {
  kafka: Kafka = new Kafka();
  bookingRepository: BookingRepository = new BookingRepository();
  constructor() {}

  isRemainTickets(eventId: string) {
    return true;
  }

  consumeBooking(bookingId: string) {
    // Process the booking
    // check remain tickets in event
    const bookingDatabase = new Booking();
    bookingDatabase.id = bookingId;
    bookingDatabase.userId = '1';
    bookingDatabase.eventId = '1';
    bookingDatabase.status = 'pending';

    if (
      bookingDatabase.status === 'pending' &&
      this.isRemainTickets(bookingDatabase.eventId)
    ) {
      bookingDatabase.status = 'approved';
      // Update the booking status in the database
      // Assuming you have a BookingRepository to handle database operations
      this.bookingRepository.updateStatus(
        bookingDatabase.id,
        bookingDatabase.status,
      );
    }

    this.kafka.send('resultBooking', bookingDatabase);

    // check user's ticket
    return 'This action adds a new booking';
  }
}
