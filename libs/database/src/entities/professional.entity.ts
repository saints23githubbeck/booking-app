
import {
  Column,
  Entity,
} from 'typeorm';
import { DatabaseBaseEntity } from './base.entity';

@Entity('professionals')
export class ProfessionalEntity extends DatabaseBaseEntity  {
  @Column()
  name: string;

  @Column()
  category: string;

  @Column()
  rate_per_minute: number;

  @Column('float')
  location_lat: number;

  @Column('float')
  location_long: number;

  
  @Column({ type: 'text', nullable: true })
  description: string;
}


