import { IsInt, IsPositive } from 'class-validator';

export class CreateBookingDto {
  @IsInt()
  userId: number;

  @IsInt()
  eventId: number;

  @IsPositive()
  quantity: number;
}
