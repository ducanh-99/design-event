import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import Redis from 'ioredis-mock';
import { BookingService } from './booking.service';
import { Booking } from './entities/booking.entity';
import { Kafka } from 'kafkajs';
import { KafkaTopics } from '../constant';

describe('BookingService', () => {
  let bookingService: BookingService;
  let kafkaClientMock: any;
  let redisMock: Redis;

  const mockBookingRepository = {
    save: vi.fn(),
  };

  beforeEach(async () => {
    kafkaClientMock = {
      emit: vi.fn().mockReturnValue({
        subscribe: vi.fn(),
      }),
    };

    redisMock = new Redis();

    const moduleRef = await Test.createTestingModule({
      providers: [
        BookingService,
        {
          provide: getRepositoryToken(Booking),
          useValue: mockBookingRepository,
        },
        { provide: 'KAFKA_SERVICE', useValue: kafkaClientMock },
        {
          provide: 'default_IORedisModuleConnectionToken',
          useValue: redisMock,
        },
      ],
    }).compile();

    bookingService = moduleRef.get<BookingService>(BookingService);
  });

  it('should be defined', () => {
    expect(bookingService).toBeDefined();
  });

  describe('createBooking', () => {
    it('should emit a booking request to Kafka', async () => {
      const createBookingDto = { userId: 1, eventId: 101, quantity: 2 };
      await bookingService.createBooking(createBookingDto);
      expect(kafkaClientMock.emit).toHaveBeenCalledWith(
        KafkaTopics.bookingRequests,
        JSON.stringify(createBookingDto),
      );
    });
  });

  describe('handleBookingRequest', () => {
    it('should emit a confirmed booking result when tickets are available', async () => {
      const createBookingDto = { userId: 1, eventId: 101, quantity: 2 };
      vi.spyOn(redisMock, 'hget').mockResolvedValue('10');
      await bookingService.handleBookingRequest(createBookingDto);
      expect(kafkaClientMock.emit).toHaveBeenCalledWith(
        KafkaTopics.bookingResults,
        JSON.stringify({ status: 'CONFIRMED', ...createBookingDto }),
      );
    });

    it('should emit a failed booking result when tickets are unavailable', async () => {
      const createBookingDto = { userId: 1, eventId: 101, quantity: 20 };
      vi.spyOn(redisMock, 'hget').mockResolvedValue('10');
      await bookingService.handleBookingRequest(createBookingDto);
      expect(kafkaClientMock.emit).toHaveBeenCalledWith(
        KafkaTopics.bookingResults,
        JSON.stringify({ status: 'FAILED', ...createBookingDto }),
      );
    });
  });

  describe('handleBookingResult', () => {
    it('should deduct tickets and save confirmed booking', async () => {
      const result = {
        userId: 1,
        eventId: 101,
        quantity: 2,
        status: 'CONFIRMED',
      };
      vi.spyOn(redisMock, 'hincrby').mockResolvedValue(8);
      await bookingService.handleBookingResult(result);
      expect(mockBookingRepository.save).toHaveBeenCalledWith(result);
    });

    it('should save failed booking without deducting tickets', async () => {
      const result = { userId: 1, eventId: 101, quantity: 2, status: 'FAILED' };
      await bookingService.handleBookingResult(result);
      expect(mockBookingRepository.save).toHaveBeenCalledWith(result);
    });
  });
});
