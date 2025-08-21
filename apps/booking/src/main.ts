import { ValidationExceptionFilter } from '@app/utils/filters/validation-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { BookingModule } from './booking.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { httpsOptions } from '@app/utils/constants/ssl-config';
import { BookingService } from './booking/booking.service';

async function bootstrap() {
  // Initialize transactional context
  initializeTransactionalContext();

  //Create the NestJS application
  const app = await NestFactory.create(BookingModule, {
    httpsOptions,
  });

  const bookingService = app.get(BookingService);

  await bookingService.seed(); 

  //Set up validation
  app.useGlobalPipes(new ValidationPipe({ forbidNonWhitelisted: true }));
  app.useGlobalFilters(new ValidationExceptionFilter());

  //Set up swagger
  const config = new DocumentBuilder()
    .setTitle('Booking Service')
    .setDescription(
      'Booking Service - Documentation(Booking Technologies ( available port 8000, 8001))',
    )
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.BOOKING_PORT, () => {
    console.log(
      `Booking service is running on port ${process.env.BOOKING_PORT}, visit http://localhost:${process.env.BOOKING_PORT}/api to see the documentation`,
    );
  });
}
bootstrap();
