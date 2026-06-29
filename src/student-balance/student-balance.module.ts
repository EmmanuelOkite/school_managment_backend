import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentBalance } from './entities/student-balance.entity';
import { Student } from '../../student/entities/student.entity';
import { StudentBalanceService } from './student-balance.service';
import { StudentBalanceController } from './student-balance.controller';

@Module({
  imports: [TypeOrmModule.forFeature([StudentBalance, Student])],
  controllers: [StudentBalanceController],
  providers: [StudentBalanceService],
  exports: [StudentBalanceService, TypeOrmModule],
})
export class StudentBalanceModule {}