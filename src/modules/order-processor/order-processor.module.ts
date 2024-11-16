import { Module } from '@nestjs/common';
import { OrderProcessorService } from './order-processor.service';
import { OrderProcessorController } from './order-processor.controller';

@Module({
  controllers: [OrderProcessorController],
  providers: [OrderProcessorService],
})
export class OrderProcessorModule {}
