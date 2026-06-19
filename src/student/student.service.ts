import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './student.entity';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { StudentLevel } from './enums/student.enum';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepo: Repository<Student>,
  ) {}

  async create(dto: CreateStudentDto): Promise<Student> {
    // Guard: subjectCombination must be provided for A Level
    if (dto.level === StudentLevel.A_LEVEL && !dto.subjectCombination) {
      throw new BadRequestException(
        'subjectCombination is required for A Level students.',
      );
    }

    // Guard: subjectCombination must NOT be set for O Level
    if (dto.level === StudentLevel.O_LEVEL && dto.subjectCombination) {
      throw new BadRequestException(
        'subjectCombination should not be provided for O Level students.',
      );
    }

    const existing = await this.studentRepo.findOne({
      where: { studentId: dto.studentId },
    });
    if (existing) {
      throw new ConflictException(
        `Student with ID "${dto.studentId}" already exists.`,
      );
    }

    const student = this.studentRepo.create(dto);
    return this.studentRepo.save(student);
  }

  async findAll(): Promise<Student[]> {
    return this.studentRepo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<Student> {
    const student = await this.studentRepo.findOne({ where: { id } });
    if (!student) {
      throw new NotFoundException(`Student with UUID "${id}" not found.`);
    }
    return student;
  }

  async update(id: string, dto: UpdateStudentDto): Promise<Student> {
    const student = await this.findOne(id);

    // Determine effective level after update
    const effectiveLevel = dto.level ?? student.level;

    if (effectiveLevel === StudentLevel.A_LEVEL) {
      const effectiveCombination =
        dto.subjectCombination ?? student.subjectCombination;
      if (!effectiveCombination) {
        throw new BadRequestException(
          'subjectCombination is required for A Level students.',
        );
      }
    }

    if (effectiveLevel === StudentLevel.O_LEVEL && dto.subjectCombination) {
      throw new BadRequestException(
        'subjectCombination should not be provided for O Level students.',
      );
    }

    Object.assign(student, dto);

    // Clear subject combination when switching to O Level
    if (dto.level === StudentLevel.O_LEVEL) {
      student.subjectCombination = null;
    }

    return this.studentRepo.save(student);
  }

  async remove(id: string): Promise<{ message: string }> {
    const student = await this.findOne(id);
    await this.studentRepo.remove(student);
    return { message: `Student "${student.studentId}" deleted successfully.` };
  }
}