import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StudentModule } from './student/student.module';
import { Student } from './student/entities/student.entity';
import { TeacherModule } from './teacher/teacher.module';
import { Teacher } from './teacher/entities/teacher.entity';
import { ParentModule } from './parent/parent.module';
import { Parent } from './parent/entities/parent.entity';
import { ExamModule } from './exam/exam.module';
import { Exam } from './exam/entities/exam.entity';
import { TimetableModule } from './timetable/timetable.module';
import { Timetable } from './timetable/enums/entities/timetable.entity';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'innovation2?',
      database: process.env.DB_NAME || 'school_db',
      entities: [Student, Teacher, Parent, Exam, Timetable],
      synchronize: true,
    }),
    StudentModule,
    TeacherModule,
    ParentModule,
    ExamModule,
    TimetableModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}