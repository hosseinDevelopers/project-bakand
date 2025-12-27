// src/reservations/user-reservation.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Book } from '../books/book.entity';

@Entity('user_books')
export class UserReservation {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  
  @Column({ type: 'bigint' })
  user_id: number;

  @ManyToOne(() => User, user => user.reservations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;


  @Column({ type: 'bigint' })
  product_id: number;

  @ManyToOne(() => Book, book => book.userReservations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Book;


  @Column({ type: 'tinyint', default: 1 })
  is_active: boolean;

  
  @CreateDateColumn({ type: 'timestamp' })
  added_at: Date;


  @Column({ type: 'timestamp', nullable: true })
  removed_at: Date | null;
}
