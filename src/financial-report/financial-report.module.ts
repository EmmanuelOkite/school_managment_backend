import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeeCollection } from '../fee-collection/entities/fee-collection.entity';
import { FeeStructure } from '../fee-structure/entities/fee-structure.entity';
import { StudentBalance } from '../student-balance/entities/student-balance.entity';
import { Expense } from '../expense/entities/expense.entity';
import { FinancialReportService } from './financial-report.service';
import { FinancialReportController } from './financial-report.controller';

@Module({
  imports: [TypeOrmModule.forFeature([FeeCollection, FeeStructure, StudentBalance, Expense])],
  controllers: [FinancialReportController],
  providers: [FinancialReportService],
})
export class FinancialReportModule {}