import { Test, TestingModule } from '@nestjs/testing';
import { OrderProcessorService } from './order-processor.service';
import { Booking } from '../booking/entities/booking.entity';

describe('OrderProcessorService', () => {
  let service: OrderProcessorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrderProcessorService],
    }).compile();

    service = module.get<OrderProcessorService>(OrderProcessorService);
    service.kafka = { send: jest.fn() };
    service.bookingRepository = { updateStatus: jest.fn() };
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should process booking and update status to approved', () => {
    const bookingId = '123';
    const bookingDatabase = new Booking();
    bookingDatabase.id = bookingId;
    bookingDatabase.userId = '1';
    bookingDatabase.eventId = '1';
    bookingDatabase.status = 'pending';

    jest.spyOn(service, 'isRemainTickets').mockReturnValue(true);

    service.consumeBooking(bookingId);

    expect(service.isRemainTickets).toHaveBeenCalledWith('1');
    expect(service.kafka.send).toHaveBeenCalledWith(
      'resultBooking',
      expect.objectContaining({
        id: bookingId,
        status: 'approved',
      }),
    );
    expect(service.bookingRepository.updateStatus).toHaveBeenCalledWith(
      bookingId,
      'approved',
    );
  });
});
