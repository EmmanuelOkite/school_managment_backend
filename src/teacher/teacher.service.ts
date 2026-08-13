import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Teacher } from './entities/teacher.entity';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';

@Injectable()
export class TeacherService {
  constructor(
    @InjectRepository(Teacher)
    private readonly teacherRepo: Repository<Teacher>,
  ) {}

  async create(dto: CreateTeacherDto): Promise<Omit<Teacher, 'password'>> {
    const existingEmail = await this.teacherRepo.findOne({ where: { email: dto.email } });
    if (existingEmail)
      throw new ConflictException(`Email "${dto.email}" is already registered.`);

    const createLoginAccount = dto.createLoginAccount === true;

    if (createLoginAccount && dto.username) {
      const existingUsername = await this.teacherRepo.findOne({ where: { username: dto.username } });
      if (existingUsername)
        throw new ConflictException(`Username "${dto.username}" is already taken.`);
    }

    const teacherId = await this.generateTeacherId(dto.dateOfJoining);
    const password = createLoginAccount && dto.password ? await bcrypt.hash(dto.password, 10) : undefined;

    const teacher = this.teacherRepo.create({
      ...dto,
      teacherId,
      createLoginAccount,
      username: createLoginAccount ? dto.username : undefined,
      password,
    });
    const saved = await this.teacherRepo.save(teacher);

    return this.stripPassword(saved);
  }

  async findAll(): Promise<Omit<Teacher, 'password'>[]> {
    const teachers = await this.teacherRepo.find({ order: { createdAt: 'DESC' } });
    return teachers.map(this.stripPassword);
  }

  async findOne(id: string): Promise<Omit<Teacher, 'password'>> {
    const teacher = await this.teacherRepo.findOne({ where: { id } });
    if (!teacher) throw new NotFoundException(`Teacher with UUID "${id}" not found.`);
    return this.stripPassword(teacher);
  }

  async update(id: string, dto: UpdateTeacherDto): Promise<Omit<Teacher, 'password'>> {
    const teacher = await this.teacherRepo.findOne({ where: { id } });
    if (!teacher) throw new NotFoundException(`Teacher with UUID "${id}" not found.`);

    // If password is being updated, hash the new one
    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 10);
    }

    Object.assign(teacher, dto);
    const saved = await this.teacherRepo.save(teacher);
    return this.stripPassword(saved);
  }

  async remove(id: string): Promise<{ message: string }> {
    const teacher = await this.teacherRepo.findOne({ where: { id } });
    if (!teacher) throw new NotFoundException(`Teacher with UUID "${id}" not found.`);
    await this.teacherRepo.remove(teacher);
    return { message: `Teacher "${teacher.teacherId}" deleted successfully.` };
  }

  // Generates a unique Teacher ID / Employee Number in the form T-{joining year}-{6-digit sequence}
  private async generateTeacherId(dateOfJoining: string): Promise<string> {
    const year = new Date(dateOfJoining).getFullYear();
    const prefix = `T-${year}-`;
    const countForYear = await this.teacherRepo.count({ where: { teacherId: Like(`${prefix}%`) } });
    const sequence = String(countForYear + 1).padStart(6, '0');
    return `${prefix}${sequence}`;
  }

  // Never return the password field in responses
  private stripPassword(teacher: Teacher): Omit<Teacher, 'password'> {
    const { password, ...rest } = teacher;
    return rest;
  }
}
