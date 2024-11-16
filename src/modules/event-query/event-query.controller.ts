import { Controller } from '@nestjs/common';
import { EventQueryService } from './event-query.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class EventQueryController {
  constructor(private readonly eventQueryService: EventQueryService) {}

  @MessagePattern('eventQuery')
  get() {
    return this.eventQueryService.get();
  }
}
