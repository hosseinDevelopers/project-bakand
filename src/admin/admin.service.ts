// src/admin/admin.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { Book } from '../books/book.entity';
import { Reservation, ReservationStatus } from '../books/entity.reservation';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Book)
    private readonly bookRepo: Repository<Book>,

    @InjectRepository(Reservation)
    private readonly reservationRepo: Repository<Reservation>,
  ) {}

  
  async getDashboardStats() {
    const [
      totalUsers,
      activeReservations,
      completedReservations,
      availableBooks,
    ] = await Promise.all([
      this.userRepo.count(),
      this.reservationRepo.count({
        where: { status: ReservationStatus.ACTIVE },
      }),
      this.reservationRepo.count({
        where: { status: ReservationStatus.COMPLETED },
      }),
      this.bookRepo.count({
        where: { status: 'available' },
      }),
    ]);

    return {
      totalUsers,
      activeReservations,
      completedReservations,
      availableBooks,
    };
  }

 
  async getRecentActivities() {
    const reservations = await this.reservationRepo.find({
      relations: ['user', 'book'],
      order: { created_at: 'DESC' },
      take: 10,
    });

    return reservations.map((r) => ({
      type: 'reservation',
      message: `User ${r.user?.username} reserved the book ${r.book?.title}`,
      created_at: r.created_at,
    }));   
  }

  async getAllReservations() {
    const reservations = await this.reservationRepo.find({
      relations: ['user', 'book'], 
      order: { created_at: 'DESC' },
    });

    return reservations.map((r) => ({
      id: r.id,
      user: {
        id: r.user.id,
        name: r.user.name,
        username: r.user.username,
      },
      product: {
        id: r.book.id,
        title: r.book.title,
      },
      reserved_at: r.reserved_at,
      reserved_until: r.reserved_until,
      status: r.status,
      created_by: r.created_by,
      created_at: r.created_at,
      updated_at: r.updated_at,
    }));
  }
}
