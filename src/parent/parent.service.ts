import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Parent } from './entities/parent.entity';
import { Student } from '../student/entities/student.entity';
import { CreateParentDto } from './dto/create-parent.dto';
import { UpdateParentDto } from './dto/update-parent.dto';

@Injectable()
export class ParentService {
  constructor(
    @InjectRepository(Parent)
    private readonly parentRepo: Repository<Parent>,

    @InjectRepository(Student)
    private readonly studentRepo: Repository<Student>,
  ) {}

  async create(dto: CreateParentDto): Promise<Parent> {
    // Check that the linked student exists using their studentId (e.g. STU-2024-001)
    const student = await this.studentRepo.findOne({
      where: { studentId: dto.studentId },
    });

    if (!student) {
      throw new NotFoundException(
        `Student with ID "${dto.studentId}" does not exist. ` +
        `Please register the student before adding a parent.`,
      );
    }

    // Check for duplicate email
    const existingEmail = await this.parentRepo.findOne({
      where: { email: dto.email },
    });
    if (existingEmail) {
      throw new ConflictException(`Email "${dto.email}" is already registered.`);
    }

    const { studentId, ...parentData } = dto;
    const parent = this.parentRepo.create({ ...parentData, student });
    return this.parentRepo.save(parent);
  }

  async findAll(): Promise<Parent[]> {
    return this.parentRepo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<Parent> {
    const parent = await this.parentRepo.findOne({ where: { id } });
    if (!parent) {
      throw new NotFoundException(`Parent with UUID "${id}" not found.`);
    }
    return parent;
  }

  async findByStudent(studentId: string): Promise<Parent[]> {
    const student = await this.studentRepo.findOne({ where: { studentId } });
    if (!student) {
      throw new NotFoundException(`Student with ID "${studentId}" not found.`);
    }
    return this.parentRepo.find({
      where: { student: { studentId } },
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: string, dto: UpdateParentDto): Promise<Parent> {
    const parent = await this.findOne(id);

    // If studentId is being updated, verify the new student exists
    if (dto.studentId) {
      const student = await this.studentRepo.findOne({
        where: { studentId: dto.studentId },
      });
      if (!student) {
        throw new NotFoundException(
          `Student with ID "${dto.studentId}" does not exist.`,
        );
      }
      parent.student = student;
    }

    // If email is being updated, check it's not already taken
    if (dto.email && dto.email !== parent.email) {
      const existingEmail = await this.parentRepo.findOne({
        where: { email: dto.email },
      });
      if (existingEmail) {
        throw new ConflictException(`Email "${dto.email}" is already registered.`);
      }
    }

    const { studentId, ...updateData } = dto;
    Object.assign(parent, updateData);
    return this.parentRepo.save(parent);
  }

  async remove(id: string): Promise<{ message: string }> {
    const parent = await this.findOne(id);
    await this.parentRepo.remove(parent);
    return {
      message: `Parent "${parent.firstName} ${parent.lastName}" deleted successfully.`,
    };
  }
}