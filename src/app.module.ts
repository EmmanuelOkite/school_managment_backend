import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',                  // your DB type
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'innovation2?',
      database: process.env.DB_NAME || 'school_db',
      entities: [],
      synchronize: true,                 // auto-create tables (dev only)
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}