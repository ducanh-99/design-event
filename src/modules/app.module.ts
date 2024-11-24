import { Module } from '@nestjs/common';
import { BookingModule } from './booking/booking.module';
import { RedisModule } from '@nestjs-modules/ioredis';
import { env } from '@/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import dataSource from '@/libs/typeorm.config';

@Module({
  imports: [
    BookingModule,
    TypeOrmModule.forRoot(dataSource.options),
    RedisModule.forRoot({
      type: 'single',
      options: {
        host: env.redis.host,
        password: env.redis.password,
        port: env.redis.port,
        db: env.redis.db,
        username: env.redis.username,
      },
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
