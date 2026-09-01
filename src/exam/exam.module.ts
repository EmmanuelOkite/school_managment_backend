import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exam } from './entities/exam.entity';
import { ExamQuestion } from './entities/exam-question.entity';
import { Teacher } from '../teacher/entities/teacher.entity';
import { ExamService } from './exam.service';
import { ExamController } from './exam.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Exam, ExamQuestion, Teacher])],
  controllers: [ExamController],
  providers: [ExamService],
  exports: [ExamService],
})
export class ExamModule {}