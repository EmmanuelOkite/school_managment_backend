import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const dataSource = app.get(DataSource);
  if (dataSource.isInitialized) {
    console.log('✅ Database connected successfully!');
  }

  await app.listen(3000);
}
bootstrap();