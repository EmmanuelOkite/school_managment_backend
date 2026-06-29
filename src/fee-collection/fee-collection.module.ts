import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeeCollection } from './entities/fee-collection.entity';
import { Student } from '../student/entities/student.entity';
import { FeeStructure } from '../fee-structure/entities/fee-structure.entity';
import { StudentBalance } from '../student-balance/entities/student-balance.entity';
import { FeeCollectionService } from './fee-collection.service';
import { FeeCollectionController } from './fee-collection.controller';

@Module({
  imports: [TypeOrmModule.forFeature([FeeCollection, Student, FeeStructure, StudentBalance])],
  controllers: [FeeCollectionController],
  providers: [FeeCollectionService],
  exports: [FeeCollectionService, TypeOrmModule],
})
export class FeeCollectionModule {}