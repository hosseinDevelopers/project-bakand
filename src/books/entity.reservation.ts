import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Book } from '../books/book.entity';
import { User } from '../users/user.entity';

export enum ReservationStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  COMPLETED = 'completed',
}

@Entity('reservations')
export class Reservation {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;


  @Column({ type: 'bigint' })
  user_id: number;

  @ManyToOne(() => User, (user) => user.reservations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  
  @Column({ type: 'bigint' })
  product_id: number;

  @ManyToOne(() => Book, (book) => book.reservations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  book: Book;

  
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  reserved_at: Date;

  @Column({ type: 'datetime' })
  reserved_until: Date;

  
  @Column({
    type: 'enum',
    enum: ReservationStatus,
    default: ReservationStatus.ACTIVE,
  })
  status: ReservationStatus;

  
  @Column({ type: 'bigint', nullable: true })
  created_by: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
