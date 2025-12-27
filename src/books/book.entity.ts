import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Reservation } from './entity.reservation';
import { UserReservation } from '../users/Purchased.entity';

@Entity('products')
export class Book {
  @OneToMany(() => UserReservation, (ur) => ur.product)
  userReservations: UserReservation[];

  @OneToMany(() => Reservation, (reservation) => reservation.book)
  reservations: Reservation[];

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
  title: string;

  @Column({ length: 150 })
  author: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  image_url: string | null;

  @Column({
    type: 'enum',
    enum: ['available', 'reserved'],
    default: 'available',
  })
  status: 'available' | 'reserved';

  @Column({ type: 'bigint', nullable: true })
  created_by: number | null;

  @Column({ type: 'bigint', nullable: true })
  updated_by: number | null;

  @Column({ type: 'bigint', nullable: true })
  deleted_by: number | null;

  @Column({ type: 'timestamp', nullable: true })
  deleted_at: Date | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ type: 'varchar', length: 10, default: '' })
  stars: string;

  @Column({ type: 'int', nullable: true })
  reservation_duration?: number;
}
