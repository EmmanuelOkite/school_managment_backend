import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Announcement } from './entities/announcement.entity';
import { Student } from '../student/entities/student.entity';
import { Teacher } from '../teacher/entities/teacher.entity';
import { FeeCollection } from '../fee-collection/entities/fee-collection.entity';
import { StudentBalance } from '../student-balance/entities/student-balance.entity';
import { Exam } from '../exam/entities/exam.entity';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Announcement,
      Student,
      Teacher,
      FeeCollection,
      StudentBalance,
      Exam,
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}