import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FeeStructure } from './entities/fee-structure.entity';
import { CreateFeeStructureDto } from './dto/create-fee-structure.dto';
import { UpdateFeeStructureDto } from './dto/update-fee-structure.dto';

@Injectable()
export class FeeStructureService {
  constructor(
    @InjectRepository(FeeStructure)
    private readonly repo: Repository<FeeStructure>,
  ) {}

  async create(dto: CreateFeeStructureDto): Promise<FeeStructure> {
    return this.repo.save(this.repo.create(dto));
  }

  async findAll(): Promise<FeeStructure[]> {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<FeeStructure> {
    const record = await this.repo.findOne({ where: { id } });
    if (!record) throw new NotFoundException(`Fee structure "${id}" not found.`);
    return record;
  }

  async findByClass(classId: string): Promise<FeeStructure[]> {
    return this.repo.find({ where: { classId }, order: { term: 'ASC' } });
  }

  async findByTerm(term: string): Promise<FeeStructure[]> {
    return this.repo.find({ where: { term }, order: { classId: 'ASC' } });
  }

  async update(id: string, dto: UpdateFeeStructureDto): Promise<FeeStructure> {
    const record = await this.findOne(id);
    Object.assign(record, dto);
    return this.repo.save(record);
  }

  async remove(id: string): Promise<{ message: string }> {
    const record = await this.findOne(id);
    await this.repo.remove(record);
    return { message: `Fee structure deleted successfully.` };
  }
}