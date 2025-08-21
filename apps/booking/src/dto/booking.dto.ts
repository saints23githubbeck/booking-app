
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class BookingDto {
  @ApiProperty({
    description: 'Profession id',
    example: 'fd6a2b68-3609-4609-bf5f-934a18ad6946',
    required: true,
  })
  @IsUUID()
  professional_id: string;

  @ApiProperty({
    description: 'Starting Date',
    example: '2025-08-20T14:30:00.000Z',
    required: true,
  })
  start_date: Date;
  
  @ApiProperty({
    description: 'Duration time in minutes',
    example: 60,
    required: true,
  })
  duration_time: number


  @ApiProperty({
    description: 'Client name',
    example: "Kofi kwade3",
    required: true,
  })
  @IsString()
  clientName: string;

  @ApiProperty({
    description: 'client email',
    example: 'kofi@mail.com',
    required: true,
  })

  @IsEmail()
  clientEmail: string;


  @ApiProperty({
    description: 'client phone number',
    example: '98332-654-786',
    required: true,
  })

  @IsString()
  clientPhone: string;


  @ApiProperty({
    description: 'idempotency Key',
    example: '09ikj87-877',
    required: true,
  })
  @IsOptional()
  @IsString()
  idempotencyKey?: string;
 
}
