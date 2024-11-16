import { Controller } from '@nestjs/common';
import { OrderProcessorService } from './order-processor.service';

@Controller()
export class OrderProcessorController {
  constructor(private readonly orderProcessorService: OrderProcessorService) {}
}
