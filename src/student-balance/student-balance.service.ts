import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentBalance } from './entities/student-balance.entity';
import { Student } from '../student/entities/student.entity';
import { UpdateStudentBalanceDto } from './dto/update-student-balance.dto';
import { BalanceStatus } from './enums/student-balance.enum';

@Injectable()
export class StudentBalanceService {
  constructor(
    @InjectRepository(StudentBalance)
    private readonly repo: Repository<StudentBalance>,
    @InjectRepository(Student)
    private readonly studentRepo: Repository<Student>,
  ) {}

  async findAll(): Promise<StudentBalance[]> {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async findByStudent(studentId: string): Promise<StudentBalance> {
    const student = await this.studentRepo.findOne({ where: { studentId } });
    if (!student) throw new NotFoundException(`Student "${studentId}" not found.`);
    const balance = await this.repo.findOne({ where: { student: { id: student.id } } });
    if (!balance) throw new NotFoundException(`No balance record found for student "${studentId}".`);
    return balance;
  }

  async update(studentId: string, dto: UpdateStudentBalanceDto): Promise<StudentBalance> {
    const balance = await this.findByStudent(studentId);
    if (dto.totalFees !== undefined) {
      balance.totalFees = dto.totalFees;
      balance.balance = Number(dto.totalFees) - Number(balance.totalPaid);
      balance.status =
        balance.balance <= 0
          ? BalanceStatus.PAID
          : balance.totalPaid > 0
          ? BalanceStatus.PARTIAL
          : BalanceStatus.UNPAID;
    }
    return this.repo.save(balance);
  }
}