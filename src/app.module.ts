import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { userModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { User } from './users/user.entity';
import { BookMoudule } from './books/books.module';
import { Book } from './books/book.entity';
import { Reservation } from './books/entity.reservation';
import { ScheduleModule } from '@nestjs/schedule';
import { AdminModule } from './admin/admin.module';
import { UserReservation } from './users/Purchased.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [User, Book, Reservation, UserReservation],
      synchronize: false,
    }),
    ScheduleModule.forRoot(),
    userModule,
    AuthModule,
    BookMoudule,
    AdminModule,
  ],
})
export class AppModule {}
