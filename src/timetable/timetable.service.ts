import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Timetable } from './entities/timetable.entity';
import { Teacher } from '../teacher/entities/teacher.entity';
import { Exam } from '../exam/entities/exam.entity';
import { CreateTimetableDto } from './dto/create-timetable.dto';
import { UpdateTimetableDto } from './dto/update-timetable.dto';
import { TimetableType, TimetableStatus, DayOfWeek } from './enums/timetable.enum';

@Injectable()
export class TimetableService {
  constructor(
    @InjectRepository(Timetable)
    private readonly timetableRepo: Repository<Timetable>,

    @InjectRepository(Teacher)
    private readonly teacherRepo: Repository<Teacher>,

    @InjectRepository(Exam)
    private readonly examRepo: Repository<Exam>,
  ) {}

  // ── Helpers ─────────────────────────────────────────────────────────────────

  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  private timesOverlap(
    newStart: string,
    newEnd: string,
    existingStart: string,
    existingEnd: string,
  ): boolean {
    const newS = this.timeToMinutes(newStart);
    const newE = this.timeToMinutes(newEnd);
    const exS = this.timeToMinutes(existingStart);
    const exE = this.timeToMinutes(existingEnd);
    return newS < exE && newE > exS;
  }

  /**
   * Checks for overlapping slots for the same teacher, class, or room
   * on the same day. Excludes the current record when updating.
   */
  private async checkOverlaps(
    dto: { teacherId?: string; classId?: string; room?: string; dayOfWeek: DayOfWeek; startTime: string; endTime: string },
    teacher: Teacher,
    excludeId?: string,
  ): Promise<void> {
    const existingSlots = await this.timetableRepo.find({
      where: {
        dayOfWeek: dto.dayOfWeek,
        status: TimetableStatus.ACTIVE,
        ...(excludeId ? { timetableId: Not(excludeId) } : {}),
      },
    });

    for (const slot of existingSlots) {
      if (!this.timesOverlap(dto.startTime, dto.endTime, slot.startTime, slot.endTime)) {
        continue;
      }

      // Same teacher overlap
      if (slot.teacher.teacherId === teacher.teacherId) {
        throw new ConflictException(
          `Teacher "${teacher.firstName} ${teacher.lastName}" already has a timetable slot on ` +
          `${dto.dayOfWeek} from ${slot.startTime} to ${slot.endTime}.`,
        );
      }

      // Same class overlap
      if (slot.classId === dto.classId) {
        throw new ConflictException(
          `Class "${dto.classId}" already has a timetable slot on ` +
          `${dto.dayOfWeek} from ${slot.startTime} to ${slot.endTime}.`,
        );
      }

      // Same room overlap
      if (slot.room === dto.room) {
        throw new ConflictException(
          `Room "${dto.room}" is already booked on ` +
          `${dto.dayOfWeek} from ${slot.startTime} to ${slot.endTime}.`,
        );
      }
    }
  }

  // ── CRUD ────────────────────────────────────────────────────────────────────

  async create(dto: CreateTimetableDto): Promise<Timetable> {
    // Validate end time > start time
    if (dto.endTime <= dto.startTime) {
      throw new BadRequestException('End time must be after start time.');
    }

    // Validate teacher exists
    const teacher = await this.teacherRepo.findOne({
      where: { teacherId: dto.teacherId },
    });
    if (!teacher) {
      throw new NotFoundException(
        `Teacher with ID "${dto.teacherId}" does not exist.`,
      );
    }

    // Validate exam exists for Exam timetable type
    let exam: Exam | undefined;
    if (dto.timetableType === TimetableType.EXAM) {
      if (!dto.examId) {
        throw new BadRequestException('examId is required for Exam timetable type.');
      }
      const foundExam = await this.examRepo.findOne({
        where: { examCode: dto.examId },
      });
      if (!foundExam) {
        throw new NotFoundException(
          `Exam with code "${dto.examId}" does not exist.`,
        );
      }
      exam = foundExam;
    }

    // Check for overlaps
    await this.checkOverlaps(
      { teacherId: dto.teacherId, classId: dto.classId, room: dto.room, dayOfWeek: dto.dayOfWeek, startTime: dto.startTime, endTime: dto.endTime },
      teacher,
    );

    const { teacherId, examId, ...timetableData } = dto;
    const timetable = this.timetableRepo.create({
      ...timetableData,
      teacher,
      ...(exam ? { exam } : {}),
    });

    return this.timetableRepo.save(timetable);
  }

  async findAll(): Promise<Timetable[]> {
    return this.timetableRepo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<Timetable> {
    const timetable = await this.timetableRepo.findOne({
      where: { timetableId: id },
    });
    if (!timetable) {
      throw new NotFoundException(`Timetable with UUID "${id}" not found.`);
    }
    return timetable;
  }

  async findByType(type: TimetableType): Promise<Timetable[]> {
    return this.timetableRepo.find({
      where: { timetableType: type },
      order: { dayOfWeek: 'ASC', startTime: 'ASC' },
    });
  }

  async findByClass(classId: string): Promise<Timetable[]> {
    return this.timetableRepo.find({
      where: { classId },
      order: { dayOfWeek: 'ASC', startTime: 'ASC' },
    });
  }

  async findByTeacher(teacherId: string): Promise<Timetable[]> {
    const teacher = await this.teacherRepo.findOne({ where: { teacherId } });
    if (!teacher) {
      throw new NotFoundException(`Teacher with ID "${teacherId}" not found.`);
    }
    return this.timetableRepo.find({
      where: { teacher: { teacherId } },
      order: { dayOfWeek: 'ASC', startTime: 'ASC' },
    });
  }

  async findByDay(day: DayOfWeek): Promise<Timetable[]> {
    return this.timetableRepo.find({
      where: { dayOfWeek: day },
      order: { startTime: 'ASC' },
    });
  }

  async update(id: string, dto: UpdateTimetableDto): Promise<Timetable> {
    const timetable = await this.findOne(id);

    // Validate end time > start time
    const effectiveStart = dto.startTime ?? timetable.startTime;
    const effectiveEnd = dto.endTime ?? timetable.endTime;
    if (effectiveEnd <= effectiveStart) {
      throw new BadRequestException('End time must be after start time.');
    }

    // If teacher is being changed, verify new teacher exists
    let teacher = timetable.teacher;
    if (dto.teacherId && dto.teacherId !== timetable.teacher.teacherId) {
      const newTeacher = await this.teacherRepo.findOne({
        where: { teacherId: dto.teacherId },
      });
      if (!newTeacher) {
        throw new NotFoundException(
          `Teacher with ID "${dto.teacherId}" does not exist.`,
        );
      }
      teacher = newTeacher;
      timetable.teacher = teacher;
    }

    // If exam is being changed, verify new exam exists
    if (dto.examId) {
      const foundExam = await this.examRepo.findOne({
        where: { examCode: dto.examId },
      });
      if (!foundExam) {
        throw new NotFoundException(`Exam with code "${dto.examId}" does not exist.`);
      }
      timetable.exam = foundExam;
    }

    // Check overlaps excluding current record
    const effectiveDay = dto.dayOfWeek ?? timetable.dayOfWeek;
    const effectiveRoom = dto.room ?? timetable.room;
    const effectiveClass = dto.classId ?? timetable.classId;

    await this.checkOverlaps(
      { teacherId: teacher.teacherId, classId: effectiveClass, room: effectiveRoom, dayOfWeek: effectiveDay, startTime: effectiveStart, endTime: effectiveEnd },
      teacher,
      id,
    );

    const { teacherId, examId, ...updateData } = dto;
    Object.assign(timetable, updateData);
    return this.timetableRepo.save(timetable);
  }

  async remove(id: string): Promise<{ message: string }> {
    const timetable = await this.findOne(id);
    await this.timetableRepo.remove(timetable);
    return { message: `Timetable entry "${timetable.title}" deleted successfully.` };
  }
}