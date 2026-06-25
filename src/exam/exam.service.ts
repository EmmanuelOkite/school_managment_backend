import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exam } from './entities/exam.entity';
import { Teacher } from '../teacher/entities/teacher.entity';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { ExamStatus } from './enums/exam.enum';

@Injectable()
export class ExamService {
  constructor(
    @InjectRepository(Exam)
    private readonly examRepo: Repository<Exam>,

    @InjectRepository(Teacher)
    private readonly teacherRepo: Repository<Teacher>,
  ) {}

  async create(dto: CreateExamDto): Promise<Exam> {
    // Verify teacher exists
    const teacher = await this.teacherRepo.findOne({
      where: { teacherId: dto.teacherId },
    });
    if (!teacher) {
      throw new NotFoundException(
        `Teacher with ID "${dto.teacherId}" does not exist. ` +
        `Please register the teacher before creating an exam.`,
      );
    }

    // Check unique exam code
    const existing = await this.examRepo.findOne({
      where: { examCode: dto.examCode },
    });
    if (existing) {
      throw new ConflictException(`Exam code "${dto.examCode}" already exists.`);
    }

    // Validate pass mark does not exceed total marks
    if (dto.passMark > dto.totalMarks) {
      throw new BadRequestException(
        `Pass mark (${dto.passMark}) cannot be greater than total marks (${dto.totalMarks}).`,
      );
    }

    // Validate end time is after start time
    if (dto.endTime <= dto.startTime) {
      throw new BadRequestException('End time must be after start time.');
    }

    const { teacherId, ...examData } = dto;
    const exam = this.examRepo.create({ ...examData, teacher });
    return this.examRepo.save(exam);
  }

  async findAll(): Promise<Exam[]> {
    return this.examRepo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<Exam> {
    const exam = await this.examRepo.findOne({ where: { id } });
    if (!exam) throw new NotFoundException(`Exam with UUID "${id}" not found.`);
    return exam;
  }

  async findByClass(className: string): Promise<Exam[]> {
    return this.examRepo.find({
      where: { class: className },
      order: { examDate: 'ASC' },
    });
  }

  async findByStatus(status: ExamStatus): Promise<Exam[]> {
    return this.examRepo.find({
      where: { status },
      order: { examDate: 'ASC' },
    });
  }

  async update(id: string, dto: UpdateExamDto): Promise<Exam> {
    const exam = await this.findOne(id);

    // If teacher is being updated, verify new teacher exists
    if (dto.teacherId) {
      const teacher = await this.teacherRepo.findOne({
        where: { teacherId: dto.teacherId },
      });
      if (!teacher) {
        throw new NotFoundException(
          `Teacher with ID "${dto.teacherId}" does not exist.`,
        );
      }
      exam.teacher = teacher;
    }

    // If exam code is being changed, check it's not taken
    if (dto.examCode && dto.examCode !== exam.examCode) {
      const existing = await this.examRepo.findOne({
        where: { examCode: dto.examCode },
      });
      if (existing) {
        throw new ConflictException(`Exam code "${dto.examCode}" already exists.`);
      }
    }

    // Validate pass mark vs total marks
    const effectiveTotalMarks = dto.totalMarks ?? exam.totalMarks;
    const effectivePassMark = dto.passMark ?? exam.passMark;
    if (effectivePassMark > effectiveTotalMarks) {
      throw new BadRequestException(
        `Pass mark (${effectivePassMark}) cannot be greater than total marks (${effectiveTotalMarks}).`,
      );
    }

    // Validate times
    const effectiveStart = dto.startTime ?? exam.startTime;
    const effectiveEnd = dto.endTime ?? exam.endTime;
    if (effectiveEnd <= effectiveStart) {
      throw new BadRequestException('End time must be after start time.');
    }

    const { teacherId, ...updateData } = dto;
    Object.assign(exam, updateData);
    return this.examRepo.save(exam);
  }

  async remove(id: string): Promise<{ message: string }> {
    const exam = await this.findOne(id);

    // Prevent deletion of ongoing exams
    if (exam.status === ExamStatus.ONGOING) {
      throw new BadRequestException('Cannot delete an exam that is currently ongoing.');
    }

    await this.examRepo.remove(exam);
    return { message: `Exam "${exam.examName}" (${exam.examCode}) deleted successfully.` };
  }
}