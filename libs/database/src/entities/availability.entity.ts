
import {
  Column,
  Entity,
  ManyToOne,
} from 'typeorm';
import { DatabaseBaseEntity } from './base.entity';
import { ProfessionalEntity } from './professional.entity';

@Entity('availabilities')
export class AvailabilityEntity extends DatabaseBaseEntity  {

  @ManyToOne(() => ProfessionalEntity)
  professional_id: ProfessionalEntity;

  @Column()
  start_time: Date;

  @Column()
  end_time: Date;

  @Column({ default: true })
  is_available: boolean;
}


