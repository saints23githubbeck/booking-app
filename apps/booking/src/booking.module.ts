import { Module } from '@nestjs/common';
import { ConfigModule} from '@nestjs/config';
import { BookingController } from './booking/booking.controller';
import { BookingService } from './booking/booking.service';
import { DatabaseModule } from '@app/database';
import { BookingEntity } from '@app/database/entities/booking.entity';
import { AvailabilityEntity } from '@app/database/entities/availability.entity';
import { ProfessionalEntity } from '@app/database/entities/professional.entity';
import { IdempotencyKeyEntity } from '@app/database/entities/idempotency.entity';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    // BookingEntity,
    // IdempotencyKeyEntity, 
    //   ProfessionalEntity,
    //   AvailabilityEntity,
  ],
  controllers: [BookingController],
  providers: [
    BookingService
  ],
})
export class BookingModule {}
