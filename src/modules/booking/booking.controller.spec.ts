/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { beforeEach, describe, expect, it, vitest } from 'vitest';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';

describe('BookingController', () => {
  let bookingController: BookingController;
  let bookingService: BookingService;

  const mockBookingService = {
    handleBookingResult: vitest.fn(),
    handleBookingRequest: vitest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookingController],
      providers: [{ provide: BookingService, useValue: mockBookingService }],
    }).compile();

    bookingController = module.get<BookingController>(BookingController);
    bookingService = module.get<BookingService>(BookingService);
  });

  it('should be defined', () => {
    expect(bookingController).toBeDefined();
  });

  it('should log and handle booking results', async () => {
    const message = { eventId: 1, status: 'CONFIRMED' };
    const loggerSpy = vitest
      .spyOn(Logger.prototype, 'log')
      .mockImplementation(() => {});
    await bookingController.consumeBookingResult(message);

    console.log('message', message, loggerSpy);
    expect(loggerSpy).toHaveBeenCalledWith(
      `Received message booking result: ${message}`,
    );
    expect(mockBookingService.handleBookingResult).toHaveBeenCalledWith(
      message,
    );
  });

  it('should log and handle booking requests', async () => {
    const message = { userId: 1, eventId: 101, quantity: 2 };
    const loggerSpy = vitest
      .spyOn(Logger.prototype, 'log')
      .mockImplementation(() => {});
    await bookingController.consumeBookingRequest(message);
    expect(loggerSpy).toHaveBeenCalledWith(
      `Received message booking requests: ${message}`,
    );
    expect(mockBookingService.handleBookingRequest).toHaveBeenCalledWith(
      message,
    );
  });
});
