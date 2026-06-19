import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove properties not in DTO
      forbidNonWhitelisted: true, // Throw error for unknown fields
      transform: true, // Automatically transform payload types
    }),
  );

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('School Management API')
    .setDescription(
      'REST API for managing school records including students, staff, and classes.',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .addTag(
      'Students',
      'Endpoints for creating, reading, updating, and deleting student records',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  console.log(`Application running on: http://localhost:${port}`);
  console.log(`Swagger docs available at: http://localhost:${port}/api/docs`);
}

bootstrap();
