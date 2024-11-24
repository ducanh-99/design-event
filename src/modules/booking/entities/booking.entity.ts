import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  eventId: number;

  @Column()
  quantity: number;

  @Column({ default: 'PENDING' })
  status: 'PENDING' | 'CONFIRMED' | 'FAILED';

  @CreateDateColumn()
  createdAt: Date;
}
