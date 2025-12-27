import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CreateBookDto } from './dto/book.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Book } from './book.entity';
import * as jwt from 'jsonwebtoken';
import { Reservation, ReservationStatus } from './entity.reservation';
import { CreateReservationDto } from './dto/rezerv.dto';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UpdateBookDto } from './dto/update.dto.';

@Injectable()
export class BookServis {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepo: Repository<Book>,
    @InjectRepository(Reservation)
    private readonly reservationRepo: Repository<Reservation>, 
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleExpiredReservationsCron() {
    try {
      await this.checkExpiredReservations();
      console.log('Checked expired reservations at', new Date().toISOString());
    } catch (err) {
      console.error('Error checking expired reservations:', err);
    }
  }
 
  async postBook(req: any, payload: CreateBookDto) {
    if (!req.session || !req.session.admin || !req.session.admin.loggedIn) {
      throw new UnauthorizedException('Admin not logged in');
    }

    const book = this.bookRepo.create({
      title: payload.title,
      author: payload.author,
      price: payload.price,
      image_url: payload.img,
      description: payload.description,
      created_by: req.session.admin.id,
      updated_by: req.session.admin.id,
      status: 'available',
      stars: payload.stars,
      reservation_duration: payload.reservationDuration,
    });

    return await this.bookRepo.save(book);
  }

  async getAllBooks() {
    return this.bookRepo.find();
  }


  async getBookById(id: number) {
    const book = await this.bookRepo.findOne({
      where: { id },
      relations: ['reservations', 'reservations.user'],
    });

    if (book?.reservations) {
      book.reservations = book.reservations.filter(
        (r) => r.status === ReservationStatus.ACTIVE,
      );
    }

    return book;
  }

  async reserveBook(authHeader: string, payload: CreateReservationDto) {
    if (!authHeader) throw new UnauthorizedException('No token provided');

    const token = authHeader.split(' ')[1];
    let decoded: any;
    try {
      decoded = jwt.verify(token, 'MY_SUPER_SECRET');
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }

    const userId = decoded.sub;

    const book = await this.bookRepo.findOne({
      where: { id: payload.bookId, status: 'available' },
    });

    if (!book) throw new BadRequestException('Book not available');

    const duration = book.reservation_duration ?? 30;
    const now = new Date();
    const reservedUntil = new Date(now.getTime() + duration * 60 * 1000); // بر حسب ساعت

    const reservation = this.reservationRepo.create({
      user_id: userId,
      product_id: book.id,
      reserved_at: now,
      reserved_until: reservedUntil,
      status: ReservationStatus.ACTIVE,
      created_by: userId,
    });

    await this.reservationRepo.save(reservation);

    book.status = 'reserved';
    await this.bookRepo.save(book);

    return reservation;
  }

  private async checkExpiredReservations() {
    const now = new Date();

  
    const reservations = await this.reservationRepo.find({
      where: { status: ReservationStatus.ACTIVE },
      relations: ['book'],
    });

    for (const reservation of reservations) {
      if (reservation.reserved_until < now) {
      
        reservation.status = ReservationStatus.COMPLETED;
        await this.reservationRepo.save(reservation);

        
        if (reservation.book) {
          reservation.book.status = 'available';
          await this.bookRepo.save(reservation.book);
        }
      }
    }
  }

  async deleteBookById(req: any, bookId: number) {
    if (!req.session || !req.session.admin || !req.session.admin.loggedIn) {
      throw new UnauthorizedException('Admin not logged in');
    }

    const book = await this.bookRepo.findOne({
      where: { id: bookId },
    });

    if (!book) {
      throw new BadRequestException('Book not found');
    }

    await this.bookRepo.remove(book);

    return {
      message: 'Book deleted successfully',
      success: true,
    };
  }

  async updateBook(
    req: any,
    id: number,
    updateBookDto: UpdateBookDto,
  ): Promise<Book> {
    if (!req.session || !req.session.admin || !req.session.admin.loggedIn) {
      throw new UnauthorizedException('Admin not logged in');
    }
    const book = await this.bookRepo.findOne({ where: { id } });
    if (!book) {
      throw new NotFoundException('Book not found');
    }

    Object.assign(book, updateBookDto);

    return this.bookRepo.save(book);
  }

  async searchBooks(query: string) {
    if (!query) return [];

    return this.bookRepo.find({
      where: [{ title: Like(`%${query}%`) }],
    });
  }

  async getActiveUserReservations(authHeader: string) {
  if (!authHeader) {
    throw new UnauthorizedException('No token provided');
  }

  const token = authHeader.split(' ')[1];
  let decoded: any;

  try {
    decoded = jwt.verify(token, 'MY_SUPER_SECRET');
  } catch {
    throw new UnauthorizedException('Invalid token');
  }

  const userId = decoded.sub;

  const reservations = await this.reservationRepo.find({
    where: {
      user_id: userId,
      status: ReservationStatus.ACTIVE,
    },
    relations: ['book'],
    order: { reserved_until: 'ASC' },
  });

 
  return reservations.map((r) => ({
    reservationId: r.id,
    reservedUntil: r.reserved_until,
    book: {
      id: r.book.id,
      title: r.book.title,
      author: r.book.author,
      image_url: r.book.image_url,
      price: r.book.price,
    },  
  }));
}

}
