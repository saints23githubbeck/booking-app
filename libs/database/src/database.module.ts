import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { DataSource } from 'typeorm';

import { addTransactionalDataSource } from 'typeorm-transactional';
import { BookingEntity } from './entities/booking.entity';
import { ProfessionalEntity } from './entities/professional.entity';
import { AvailabilityEntity } from './entities/availability.entity';
import { IdempotencyKeyEntity } from './entities/idempotency.entity';


@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: process.env.DB_HOST,
        port: 5432,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        entities: [join(__dirname, '..', 'entities', '*.entity{.ts,.js}')],
        synchronize: false,
        logging: true,
        // dropSchema: true,
        autoLoadEntities: true,
      }),
      dataSourceFactory: async (options) => {
        if (!options) {
          throw new Error('No options provided');
        }
        return addTransactionalDataSource(new DataSource(options));
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([
      BookingEntity,
      ProfessionalEntity,
      AvailabilityEntity,
      IdempotencyKeyEntity
      
    ]),
  ],
  providers: [],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}


