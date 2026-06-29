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
import { Timetable } from './timetable/entities/timetable.entity';
import { FinancialReportModule } from './financial-report/financial-report.module';
import { Expense } from './expense/entities/expense.entity';
import { StudentBalance } from './student-balance/entities/student-balance.entity';
import { FeeStructure } from './fee-structure/entities/fee-structure.entity';
import { FeeCollection } from './fee-collection/entities/fee-collection.entity';
import { ExpenseModule } from './expense/expense.module';
import { StudentBalanceModule } from './student-balance/student-balance.module';
import { FeeStructureModule } from './fee-structure/fee-structure.module';
import { FeeCollectionModule } from './fee-collection/fee-collection.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'innovation2?',
      database: process.env.DB_NAME || 'school_db',
      entities: [Student, Teacher, Parent, Exam, Timetable, FeeCollection, FeeStructure, StudentBalance, Expense],
      synchronize: true,
    }),
    StudentModule,
    TeacherModule,
    ParentModule,
    ExamModule,
    TimetableModule,
    FinancialReportModule,
    FeeCollectionModule,
    FeeStructureModule,
    StudentBalanceModule,
    ExpenseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}