import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Class } from './entities/class.entity';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';

@Injectable()
export class ClassService {
  constructor(
    @InjectRepository(Class)
    private readonly classRepo: Repository<Class>,
  ) {}

  async create(dto: CreateClassDto): Promise<Class> {
    this.assertDistinctTeachers(dto.classTeacher, dto.assistantClassTeacher);

    const existing = await this.classRepo.findOne({
      where: { code: dto.code, academicYear: dto.academicYear },
    });
    if (existing) {
      throw new ConflictException(
        `A class with code "${dto.code}" already exists for academic year ${dto.academicYear}.`,
      );
    }

    const schoolClass = this.classRepo.create({ ...dto, currentStudentCount: 0 });
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

    const effectiveClassTeacher = dto.classTeacher ?? schoolClass.classTeacher;
    const effectiveAssistant = dto.assistantClassTeacher ?? schoolClass.assistantClassTeacher;
    this.assertDistinctTeachers(effectiveClassTeacher, effectiveAssistant);

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

    Object.assign(schoolClass, dto);
    return this.classRepo.save(schoolClass);
  }

  async remove(id: string): Promise<{ message: string }> {
    const schoolClass = await this.findOne(id);
    await this.classRepo.remove(schoolClass);
    return { message: `Class "${schoolClass.name}" deleted successfully.` };
  }

  private assertDistinctTeachers(classTeacher?: string, assistantClassTeacher?: string): void {
    if (
      classTeacher &&
      assistantClassTeacher &&
      classTeacher.trim().toLowerCase() === assistantClassTeacher.trim().toLowerCase()
    ) {
      throw new BadRequestException('Assistant class teacher must be different from the class teacher.');
    }
  }
}
