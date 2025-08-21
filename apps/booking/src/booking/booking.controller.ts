
import {
  Body,
  Controller,
  Post,
  Headers,
  BadRequestException,
  HttpCode,
  HttpStatus

} from '@nestjs/common';
import {  BookingService } from './booking.service';
import {
  BookingDto,
} from '../dto/booking.dto';
import { ApiHeader, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('bookings')

export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new booking' })
  @ApiHeader({
    name: 'Idempotency-Key',
    description: 'Unique key to prevent duplicate bookings',
    required: true, // Changed to required
  })
  @ApiResponse({ status: 201, description: 'Booking created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 409, description: 'Booking conflict or duplicate idempotency key' })
  async createBooking(
    @Body() bookingDto: BookingDto,
    @Headers('Idempotency-Key') idempotencyKey: string,
  ) {
    if (!idempotencyKey) {
      throw new BadRequestException('Idempotency-Key header is required');
    }
    console.log('Idempotency-Key:', idempotencyKey);
    return this.bookingService.booking(bookingDto, idempotencyKey);
  }
  
}