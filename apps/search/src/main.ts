import { ValidationExceptionFilter } from '@app/utils/filters/validation-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { httpsOptions } from '@app/utils/constants/ssl-config';
import { SearchModule } from './search.module';

async function bootstrap() {
  // Initialize transactional context
  initializeTransactionalContext();

  //Create the NestJS application
  const app = await NestFactory.create(SearchModule, {
    httpsOptions,
  });

  //Set up validation
  app.useGlobalPipes(new ValidationPipe({transform: true, forbidNonWhitelisted: true }));
  app.useGlobalFilters(new ValidationExceptionFilter());

  //Set up swagger
  const config = new DocumentBuilder()
    .setTitle('Search professional Service')
    .setDescription(
      'Search professional Service - Documentation(Booking Technologies ( available port 8000, 8001, 8002, 8003, 8004))',
    )
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.SEARCH_PORT, () => {
    console.log(
      `Search professional service is running on port ${process.env.SEARCH_PORT}, visit http://localhost:${process.env.SEARCH_PORT}/api to see the documentation`,
    );
  });
}
bootstrap();
