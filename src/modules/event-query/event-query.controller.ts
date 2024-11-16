import { Controller } from '@nestjs/common';
import { EventQueryService } from './event-query.service';

@Controller()
export class EventQueryController {
  constructor(private readonly eventQueryService: EventQueryService) {}
}
