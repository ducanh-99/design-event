import { Module } from '@nestjs/common';
import { EventQueryService } from './event-query.service';
import { EventQueryController } from './event-query.controller';

@Module({
  controllers: [EventQueryController],
  providers: [EventQueryService],
})
export class EventQueryModule {}
