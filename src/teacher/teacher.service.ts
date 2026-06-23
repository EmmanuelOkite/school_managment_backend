import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
    // Check unique fields
    const [existingId, existingEmail, existingStaff, existingUsername] =
      await Promise.all([
        this.teacherRepo.findOne({ where: { teacherId: dto.teacherId } }),
        this.teacherRepo.findOne({ where: { email: dto.email } }),
        this.teacherRepo.findOne({ where: { staffNumber: dto.staffNumber } }),
        this.teacherRepo.findOne({ where: { username: dto.username } }),
      ]);

    if (existingId)
      throw new ConflictException(`Teacher ID "${dto.teacherId}" already exists.`);
    if (existingEmail)
      throw new ConflictException(`Email "${dto.email}" is already registered.`);
    if (existingStaff)
      throw new ConflictException(`Staff number "${dto.staffNumber}" already exists.`);
    if (existingUsername)
      throw new ConflictException(`Username "${dto.username}" is already taken.`);

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const teacher = this.teacherRepo.create({ ...dto, password: hashedPassword });
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

  // Never return the password field in responses
  private stripPassword(teacher: Teacher): Omit<Teacher, 'password'> {
    const { password, ...rest } = teacher;
    return rest;
  }
}