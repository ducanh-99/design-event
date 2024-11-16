import { Controller } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreatePaymentDto } from './dto/payment-dto';

@Controller()
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @MessagePattern('payment')
  pay(@Payload() createPaymentDto: CreatePaymentDto) {
    return this.paymentService.pay(createPaymentDto);
  }
}
