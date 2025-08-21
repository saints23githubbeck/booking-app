
import {

  Column,
  Entity,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { DatabaseBaseEntity } from './base.entity';
import { ProfessionalEntity } from './professional.entity';
import { IsEmail } from 'class-validator';


@Entity('bookings')
export class BookingEntity extends DatabaseBaseEntity {
  @Column({ nullable:false })
  duration_time: number;


  @Column({ nullable:false })
  start_date: Date;

  @ManyToOne(() => ProfessionalEntity)
  professional: ProfessionalEntity;

  @Column('uuid')
  professional_id: string;

  @Column()
  end_time: Date;

  @Column({ nullable: true })
  total_price_cents: number;

  @Column({ default: 'pending' })
  status: string;

  @Column({ nullable: true })
  client_name: string;

  @Column({ nullable: true })
  client_phone: string;

  @Column({ nullable: true })
  client_email: string;

  @Column({ nullable: true })
  stripe_payment_id: string;

  @Column({nullable: true })
  idempotency_key: string;



}


