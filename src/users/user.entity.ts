import { Reservation } from '../books/entity.reservation';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { UserReservation } from './Purchased.entity';

@Entity('users')
export class User {
  @OneToMany(() => UserReservation, (ur) => ur.user)
  userReservations: UserReservation[];

  @OneToMany(() => Reservation, (reservation) => reservation.user)
  reservations: Reservation[];
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password_hash: string;

  @Column({ type: 'enum', enum: ['user', 'admin'], default: 'user' })
  role: 'user' | 'admin';

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ type: 'text', nullable: true })
  current_token: string | null;
}
