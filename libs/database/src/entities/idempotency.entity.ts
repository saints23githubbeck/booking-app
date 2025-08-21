
import {
  Column,
  Entity
} from 'typeorm';
import { DatabaseBaseEntity } from './base.entity';


@Entity('idempotencyKey')
export class IdempotencyKeyEntity extends DatabaseBaseEntity {

  @Column()
  key: string;
  
  @Column()
  endpoint: string;

  @Column('text')
  response: string;

  @Column()
  expires_at: Date;
}


