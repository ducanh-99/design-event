/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/payment-dto';

@Injectable()
export class PaymentService {
  stripe: any;
  repository: any;
  constructor() {
    this.stripe = {
      createCharge: () => {
        return 'PaymentService';
      },
    };
    this.repository = {
      update: (paymentId: string) => {},
    };
  }

  pay(createPaymentDto: CreatePaymentDto) {
    const paymentId =
      'PaymentService' +
      Date.now() +
      createPaymentDto.userId +
      createPaymentDto.bookingId;

    this.stripe.createCharge();
    this.repository.update(paymentId);
    return;
  }
}
