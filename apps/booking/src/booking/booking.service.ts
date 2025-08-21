
import {
  BadRequestException,

  Injectable,
 
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';

import { BookingDto } from '../dto/booking.dto';


import { BookingEntity } from '@app/database/entities/booking.entity';
import { ProfessionalEntity } from '@app/database/entities/professional.entity';
import { AvailabilityEntity } from '@app/database/entities/availability.entity';
import { IdempotencyKeyEntity } from '@app/database/entities/idempotency.entity';
import { StructuredResponse } from '@app/utils/generics/structured-response.dto';


@Injectable()
export class BookingService { // Adjust class name as needed
  constructor(
    @InjectRepository(BookingEntity)
    private bookingRepository: Repository<BookingEntity>,
    @InjectRepository(IdempotencyKeyEntity)
    private idempotencyKeyRepository: Repository<IdempotencyKeyEntity>,

    @InjectRepository(ProfessionalEntity)
    private professionalRepository: Repository<ProfessionalEntity>,
    @InjectRepository(AvailabilityEntity)
    private availabilityRepository: Repository<AvailabilityEntity>,
  
  ) {}

  // @Transactional()
  async booking(bookingDto: BookingDto, idempotency_key:string): Promise<StructuredResponse> {
    const { professional_id,start_date, duration_time,clientEmail,clientName,clientPhone} = bookingDto;
  
    try {
      const endpoint = '/bookings';
  
      // 🔑 Check idempotency cache
      const existing = await this.idempotencyKeyRepository.findOne({
        where: { key: idempotency_key, endpoint },
      });
  
      if (existing) {
        if (new Date() > existing.expires_at) {
          await this.idempotencyKeyRepository.delete({ key: existing.key }); // Clean expired
        } else {
          return {
            message: 'Booking retrieved from idempotency cache',
            payload: JSON.parse(existing.response),
          } as StructuredResponse;
        }
      }
  
      // ✅ Check professional exists
      const pro = await this.professionalRepository.findOne({ where: { id: professional_id } });
      if (!pro) throw new BadRequestException('Professional not found');
  
      // ✅ Calculate start and end times
      const startTime = new Date(start_date);
      const endTime = new Date(startTime.getTime() + duration_time * 60000);
       console.log(startTime)
       console.log(endTime)
      // ✅ Check for overlapping bookings
      const overlappingBookings = await this.bookingRepository
        .createQueryBuilder('booking')
        .where('booking.professional_id = :proId', { proId: professional_id })
        .andWhere('(booking.start_date < :end AND booking.end_time > :start)', {
          start: startTime,
          end: endTime,
        })
        .getCount();
  
      if (overlappingBookings > 0) {
        throw new BadRequestException('Booking conflict');
      }
  
      // ✅ Check professional availability
      const available = await this.availabilityRepository
        .createQueryBuilder('avail')
        .where('avail.professional_id = :proId', { proId: professional_id })
        .andWhere(':start >= avail.start_time AND :end <= avail.end_time', {
          start: startTime,
          end: endTime,
        })
        .getCount();
  
      if (available === 0) {
        throw new BadRequestException('Outside availability');
      }
  
      // ✅ Calculate total price
      const totalPrice = pro.rate_per_minute * duration_time;
  
      // ✅ Create booking
      const booking = this.bookingRepository.create({
        professional_id,
        start_date: startTime,
        duration_time,
        end_time: endTime,
        total_price_cents: totalPrice,
        client_email:clientEmail,
        client_name:clientName,
        client_phone:clientPhone,
        status: 'pending',
      });
  
      await this.bookingRepository.save(booking);
  
      // 🔑 Save idempotency record
      await this.idempotencyKeyRepository.save(
        this.idempotencyKeyRepository.create({
          key: idempotency_key,
          endpoint,
          response: JSON.stringify(booking),
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000),
        })
      );
  
      return {
        message: 'Booking created successfully',
        payload: booking,
      } as StructuredResponse;
    } catch (error) {
      throw error;
    }
  }


   // 🟢 Seeder method
   async seed(): Promise<void> {
    if ((await this.professionalRepository.count()) > 0) return; // Already seeded

    const pro1 = this.professionalRepository.create({
      name: 'John Doe',
      category: 'tutor',
      rate_per_minute: 100,
      location_lat: 37.7749,
      location_long: -122.4194,
      
    });
    await this.professionalRepository.save(pro1);

    await this.availabilityRepository.save([
      this.availabilityRepository.create({
        professional_id: pro1,
        start_time: new Date('2025-08-21T10:00:00Z'),
        end_time: new Date('2025-08-21T12:00:00Z'),
        
      }),
      this.availabilityRepository.create({
        professional_id: pro1,
        start_time: new Date('2025-08-21T14:00:00Z'),
        end_time: new Date('2025-08-21T16:00:00Z'),
      }),
    ]);

    const pro2 = this.professionalRepository.create({
      name: 'Jane Smith',
      category: 'consultant',
      rate_per_minute: 200,
      location_lat: 37.7849,
      location_long: -122.4294,
    });
    await this.professionalRepository.save(pro2);

    await this.availabilityRepository.save([
      this.availabilityRepository.create({
        professional_id: pro2,
        start_time: new Date('2025-08-21T09:00:00Z'),
        end_time: new Date('2025-08-21T11:00:00Z'),
      }),
      this.availabilityRepository.create({
        professional_id: pro2,
        start_time: new Date('2025-08-21T13:00:00Z'),
        end_time: new Date('2025-08-21T15:00:00Z'),
      }),
    ]);

    const pro3 = this.professionalRepository.create({
      name: 'Mike Johnson',
      category: 'trainer',
      rate_per_minute: 150,
      location_lat: 37.8044,
      location_long: -122.2711,
    });
    await this.professionalRepository.save(pro3);

    await this.availabilityRepository.save([
      this.availabilityRepository.create({
        professional_id: pro3,
        start_time: new Date('2025-08-21T08:00:00Z'),
        end_time: new Date('2025-08-21T10:00:00Z'),
      }),
      this.availabilityRepository.create({
        professional_id: pro3,
        start_time: new Date('2025-08-21T12:00:00Z'),
        end_time: new Date('2025-08-21T14:00:00Z'),
      }),
    ]);

    console.log('✅ Seed data inserted successfully');
  }
  
}
