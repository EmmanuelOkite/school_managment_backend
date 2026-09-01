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
import { Student } from '../student/entities/student.entity';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { ExamStatus, AssignmentMethod } from './enums/exam.enum';

@Injectable()
export class ExamService {
  constructor(
    @InjectRepository(Exam)
    private readonly examRepo: Repository<Exam>,

    @InjectRepository(Teacher)
    private readonly teacherRepo: Repository<Teacher>,

    @InjectRepository(Student)
    private readonly studentRepo: Repository<Student>,
  ) {}

  private toMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  /**
   * Counts students in the given class. Note: the Student entity has no
   * "stream" field, so this can only filter by class, not class+stream.
   */
  private async countStudentsInClass(className: string): Promise<number> {
    return this.studentRepo
      .createQueryBuilder('student')
      .where('CAST(student.class AS text) = :className', { className })
      .getCount();
  }

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
    const durationMinutes = this.toMinutes(dto.endTime) - this.toMinutes(dto.startTime);

    const assignmentMethod = dto.assignmentMethod ?? AssignmentMethod.AUTOMATIC;
    const studentCount =
      assignmentMethod === AssignmentMethod.AUTOMATIC
        ? await this.countStudentsInClass(dto.class)
        : dto.studentCount;

    const { teacherId, ...examData } = dto;
    const exam = this.examRepo.create({
      ...examData,
      teacher,
      durationMinutes,
      assignmentMethod,
      studentCount,
    });
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
    const durationMinutes = this.toMinutes(effectiveEnd) - this.toMinutes(effectiveStart);

    // Recompute student count if assignment is (or becomes) Automatic, or the class changed
    const effectiveAssignmentMethod = dto.assignmentMethod ?? exam.assignmentMethod;
    const effectiveClass = dto.class ?? exam.class;
    const studentCount =
      effectiveAssignmentMethod === AssignmentMethod.AUTOMATIC
        ? await this.countStudentsInClass(effectiveClass)
        : (dto.studentCount ?? exam.studentCount);

    const { teacherId, ...updateData } = dto;
    Object.assign(exam, updateData, { durationMinutes, studentCount });
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