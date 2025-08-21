
import { TravelCategory } from '@app/utils/filters/enums';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsOptional,
} from 'class-validator';



export class SearchProfessionalDto {
  @ApiProperty({
    description: 'Latitude coordinate for search location',
    example: 5.6037,
    required: false,
  })
  @IsOptional()
  lat?: number;

  @ApiProperty({
    description: 'Longitude coordinate for search location',
    example: -0.1870,
    required: false,
  })
  @IsOptional()
  long?: number;

  @ApiProperty({
    description: 'Search radius in kilometers around the given coordinates',
    example: 10,
    required: false,
  })
  @IsOptional()
  location_radius_km?: number;

  @ApiProperty({
    description: 'Category of professional to search for',
    example: 'Plumber',
    required: false,
  })
  @IsOptional()
  category?: string;

  @ApiProperty({
    description: 'Maximum price (in cents per minute) a client is willing to pay',
    example: 500,
    required: false,
  })
  @IsOptional()

  rate_per_minute?: number;

  @ApiProperty({
    description: 'Preferred travel mode for the professional',
    example: 'car',
    required: false,
  })
  @IsOptional()
  travel_mode?: string;

  @IsOptional()
  @IsEnum(TravelCategory)
  travel_category?: TravelCategory;

}
