import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './book.entity';
import { BookServis } from './books.service';
import { BookController } from './books.controller';
import { Reservation } from './entity.reservation';
import { ScheduleModule } from '@nestjs/schedule';
import { UserReservation } from '../users/Purchased.entity';

@Module({
  providers: [BookServis],
  controllers: [BookController],
  imports: [
    TypeOrmModule.forFeature([Book, Reservation,UserReservation]),
    ScheduleModule.forRoot(), 
  ],
  exports: [BookServis],
})
export class BookMoudule {}
