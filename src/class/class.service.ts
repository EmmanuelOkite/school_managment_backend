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

// The API also exposes classTeacherId/assistantClassTeacherId as flat UUID
// strings alongside the nested teacher objects, since that's what the
// frontend list/edit views read the assigned teacher from.
export type ClassResponse = Class & {
  classTeacherId: string;
  assistantClassTeacherId?: string;
};

@Injectable()
export class ClassService {
  constructor(
    @InjectRepository(Class)
    private readonly classRepo: Repository<Class>,
    @InjectRepository(Teacher)
    private readonly teacherRepo: Repository<Teacher>,
  ) {}

  async create(dto: CreateClassDto): Promise<ClassResponse> {
    if (dto.assistantClassTeacherId && dto.assistantClassTeacherId === dto.classTeacherId) {
      throw new BadRequestException('Assistant class teacher must be different from the class teacher.');
    }

    const existing = await this.classRepo.findOne({
      where: { code: dto.code, academicYear: dto.academicYear },
    });
    if (existing) {
      throw new ConflictException(
        `A class with code "${dto.code}" already exists for academic year ${dto.academicYear}.`,
      );
    }

    const classTeacher = await this.findTeacherById(dto.classTeacherId);
    const assistantClassTeacher = dto.assistantClassTeacherId
      ? await this.findTeacherById(dto.assistantClassTeacherId)
      : undefined;

    const { classTeacherId, assistantClassTeacherId, ...rest } = dto;
    const schoolClass = this.classRepo.create({
      ...rest,
      classTeacher,
      assistantClassTeacher,
      currentStudentCount: 0,
    });
    const saved = await this.classRepo.save(schoolClass);
    return this.toResponse(saved);
  }

  async findAll(): Promise<ClassResponse[]> {
    const classes = await this.classRepo.find({ order: { createdAt: 'DESC' } });
    return classes.map((c) => this.toResponse(c));
  }

  async findOne(id: string): Promise<ClassResponse> {
    const schoolClass = await this.classRepo.findOne({ where: { id } });
    if (!schoolClass) throw new NotFoundException(`Class with UUID "${id}" not found.`);
    return this.toResponse(schoolClass);
  }

  async update(id: string, dto: UpdateClassDto): Promise<ClassResponse> {
    const schoolClass = await this.classRepo.findOne({ where: { id } });
    if (!schoolClass) throw new NotFoundException(`Class with UUID "${id}" not found.`);

    const effectiveClassTeacherId = dto.classTeacherId ?? schoolClass.classTeacher.id;
    const effectiveAssistantId = dto.assistantClassTeacherId ?? schoolClass.assistantClassTeacher?.id;
    if (effectiveAssistantId && effectiveAssistantId === effectiveClassTeacherId) {
      throw new BadRequestException('Assistant class teacher must be different from the class teacher.');
    }

    const effectiveCode = dto.code ?? schoolClass.code;
    const effectiveAcademicYear = dto.academicYear ?? schoolClass.academicYear;
    if (dto.code || dto.academicYear) {
      const existing = await this.classRepo.findOne({
        where: { code: effectiveCode, academicYear: effectiveAcademicYear },
      });
      if (existing && existing.id !== id) {
        throw new ConflictException(
          `A class with code "${effectiveCode}" already exists for academic year ${effectiveAcademicYear}.`,
        );
      }
    }

    if (dto.classTeacherId) {
      schoolClass.classTeacher = await this.findTeacherById(dto.classTeacherId);
    }
    if (dto.assistantClassTeacherId) {
      schoolClass.assistantClassTeacher = await this.findTeacherById(dto.assistantClassTeacherId);
    }

    const { classTeacherId, assistantClassTeacherId, ...rest } = dto;
    Object.assign(schoolClass, rest);
    const saved = await this.classRepo.save(schoolClass);
    return this.toResponse(saved);
  }

  async remove(id: string): Promise<{ message: string }> {
    const schoolClass = await this.classRepo.findOne({ where: { id } });
    if (!schoolClass) throw new NotFoundException(`Class with UUID "${id}" not found.`);
    await this.classRepo.remove(schoolClass);
    return { message: `Class "${schoolClass.name}" deleted successfully.` };
  }

  private async findTeacherById(id: string): Promise<Teacher> {
    const teacher = await this.teacherRepo.findOne({ where: { id } });
    if (!teacher) throw new NotFoundException(`Teacher with ID "${id}" not found.`);
    return teacher;
  }

  private toResponse(schoolClass: Class): ClassResponse {
    return {
      ...schoolClass,
      classTeacherId: schoolClass.classTeacher.id,
      assistantClassTeacherId: schoolClass.assistantClassTeacher?.id,
    };
  }
}
