import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Class } from './entities/class.entity';
import { Teacher } from '../teacher/entities/teacher.entity';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';

@Injectable()
export class ClassService {
  constructor(
    @InjectRepository(Class)
    private readonly classRepo: Repository<Class>,
    @InjectRepository(Teacher)
    private readonly teacherRepo: Repository<Teacher>,
  ) {}

  async create(dto: CreateClassDto): Promise<Class> {
    if (dto.assistantClassTeacherId && dto.assistantClassTeacherId === dto.classTeacherId) {
      throw new BadRequestException('Assistant class teacher must be different from the class teacher.');
    }

    const existing = await this.classRepo.findOne({
      where: { classCode: dto.classCode, academicYear: dto.academicYear },
    });
    if (existing) {
      throw new ConflictException(
        `A class with code "${dto.classCode}" already exists for academic year ${dto.academicYear}.`,
      );
    }

    const classTeacher = await this.findTeacherByTeacherId(dto.classTeacherId);
    const assistantClassTeacher = dto.assistantClassTeacherId
      ? await this.findTeacherByTeacherId(dto.assistantClassTeacherId)
      : undefined;

    const { classTeacherId, assistantClassTeacherId, ...rest } = dto;
    const schoolClass = this.classRepo.create({
      ...rest,
      classTeacher,
      assistantClassTeacher,
      currentStudentCount: 0,
    });
    return this.classRepo.save(schoolClass);
  }

  async findAll(): Promise<Class[]> {
    return this.classRepo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<Class> {
    const schoolClass = await this.classRepo.findOne({ where: { id } });
    if (!schoolClass) throw new NotFoundException(`Class with UUID "${id}" not found.`);
    return schoolClass;
  }

  async update(id: string, dto: UpdateClassDto): Promise<Class> {
    const schoolClass = await this.findOne(id);

    const effectiveClassTeacherId = dto.classTeacherId ?? schoolClass.classTeacher.teacherId;
    const effectiveAssistantId = dto.assistantClassTeacherId ?? schoolClass.assistantClassTeacher?.teacherId;
    if (effectiveAssistantId && effectiveAssistantId === effectiveClassTeacherId) {
      throw new BadRequestException('Assistant class teacher must be different from the class teacher.');
    }

    const effectiveClassCode = dto.classCode ?? schoolClass.classCode;
    const effectiveAcademicYear = dto.academicYear ?? schoolClass.academicYear;
    if (dto.classCode || dto.academicYear) {
      const existing = await this.classRepo.findOne({
        where: { classCode: effectiveClassCode, academicYear: effectiveAcademicYear },
      });
      if (existing && existing.id !== id) {
        throw new ConflictException(
          `A class with code "${effectiveClassCode}" already exists for academic year ${effectiveAcademicYear}.`,
        );
      }
    }

    if (dto.classTeacherId) {
      schoolClass.classTeacher = await this.findTeacherByTeacherId(dto.classTeacherId);
    }
    if (dto.assistantClassTeacherId) {
      schoolClass.assistantClassTeacher = await this.findTeacherByTeacherId(dto.assistantClassTeacherId);
    }

    const { classTeacherId, assistantClassTeacherId, ...rest } = dto;
    Object.assign(schoolClass, rest);
    return this.classRepo.save(schoolClass);
  }

  async remove(id: string): Promise<{ message: string }> {
    const schoolClass = await this.findOne(id);
    await this.classRepo.remove(schoolClass);
    return { message: `Class "${schoolClass.className}" deleted successfully.` };
  }

  private async findTeacherByTeacherId(teacherId: string): Promise<Teacher> {
    const teacher = await this.teacherRepo.findOne({ where: { teacherId } });
    if (!teacher) throw new NotFoundException(`Teacher with ID "${teacherId}" not found.`);
    return teacher;
  }
}
