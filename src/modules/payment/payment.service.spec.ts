import { Test, TestingModule } from '@nestjs/testing';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/payment-dto';
import { beforeEach, describe, expect, it, vitest } from 'vitest';

describe('PaymentService', () => {
  let service: PaymentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaymentService],
    }).compile();

    service = module.get<PaymentService>(PaymentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('pay', () => {
    it('should call stripe.createCharge and repository.update', () => {
      const createPaymentDto: CreatePaymentDto = {
        amount: '1000',
        userId: '1',
        bookingId: '1',
      };
      const stripeCreateChargeSpy = vitest.spyOn(
        service.stripe,
        'createCharge',
      );
      const repositoryUpdateSpy = vitest.spyOn(service.repository, 'update');

      service.pay(createPaymentDto);

      expect(stripeCreateChargeSpy).toHaveBeenCalled();
      expect(repositoryUpdateSpy).toHaveBeenCalledWith(
        expect.stringContaining('PaymentService'),
      );
    });
  });
});
