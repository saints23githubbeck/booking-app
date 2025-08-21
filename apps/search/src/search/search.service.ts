

import {
 
  Injectable,

} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ProfessionalEntity } from '@app/database/entities/professional.entity';
import { SearchProfessionalDto } from '../dto/searchProfessional.dto';
import { TravelCategory } from '@app/utils/filters/enums';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(ProfessionalEntity)
    private readonly professionalRepository: Repository<ProfessionalEntity>,
  ) {}



  async searchProfessionals(searchDto: SearchProfessionalDto) {
    let query = this.professionalRepository.createQueryBuilder('pro');

    if (searchDto.category) query = query.andWhere('pro.category = :category', { category: searchDto.category });
    if (searchDto.rate_per_minute) query = query.andWhere('pro.rate_per_minute <= :max', { max: searchDto.rate_per_minute });

    const pros = await query.getMany();

    // Calculate distance (Haversine approximation)
    const withDistance = pros.map(pro => {
      const distance = this.calculateDistance(searchDto.lat, searchDto.long, pro.location_lat, pro.location_long, searchDto.travel_mode || 'driving');
      return { ...pro, distance_km: distance, min_price: pro.rate_per_minute }; // min_price as rate for simplicity
    });

    // Filter by location if provided
    if (searchDto.location_radius_km) {
      return withDistance.filter(p => p.distance_km <= searchDto.location_radius_km);
    }

    return withDistance;
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number, mode: string): number {
    // Simple Haversine formula
    const R = 6371; // Earth radius km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let distance = R * c;

    // Adjust for mode (simulated multipliers)

   // Adjust distance based on travel mode speed relative to driving
   const speeds = {
    [TravelCategory.DRIVING]: 40, // km/h
    [TravelCategory.WALKING]: 5, // km/h
    [TravelCategory.BICYCLING]: 15, // km/h
    [TravelCategory.TRANSIT]: 25, // km/h
  };

  // Normalize distance by travel time (distance / speed) relative to driving
  const baseSpeed = speeds[TravelCategory.DRIVING]; // Use driving as baseline
  const travelSpeed = speeds[mode] || baseSpeed; // Fallback to driving speed
  const adjustmentFactor = baseSpeed / travelSpeed; // E.g., walking: 40/5 = 8x slower
  distance *= adjustmentFactor; // Adjust distance to reflect travel time

  return Number(distance.toFixed(2));
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }


}
