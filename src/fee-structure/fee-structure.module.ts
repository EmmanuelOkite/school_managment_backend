import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeeStructure } from './entities/fee-structure.entity';
import { FeeStructureService } from './fee-structure.service';
import { FeeStructureController } from './fee-structure.controller';

@Module({
  imports: [TypeOrmModule.forFeature([FeeStructure])],
  controllers: [FeeStructureController],
  providers: [FeeStructureService],
  exports: [FeeStructureService, TypeOrmModule],
})
export class FeeStructureModule {}