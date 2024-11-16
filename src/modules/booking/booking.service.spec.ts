import { Test, TestingModule } from '@nestjs/testing';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';

describe('BookingService', () => {
  let service: BookingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BookingService],
    }).compile();

    service = module.get<BookingService>(BookingService);
    service.kafka = { send: jest.fn() };
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('booking', () => {
    it('should send a message to kafka and return a confirmation message', () => {
      const createBookingDto: CreateBookingDto = {
        /* mock data */
        userId: '1',
        eventId: '1',
      };
      const result = service.booking(createBookingDto);

      expect(service.kafka.send).toHaveBeenCalledWith(
        'createBooking',
        createBookingDto,
      );
      expect(result).toBe('This action adds a new booking');
    });
  });
});
