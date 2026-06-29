import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FeeCollection } from './entities/fee-collection.entity';
import { Student } from '../student/entities/student.entity';
import { FeeStructure } from '../fee-structure/entities/fee-structure.entity';
import { StudentBalance } from '../student-balance/entities/student-balance.entity';
import { CreateFeeCollectionDto } from './dto/create-fee-collection.dto';
import { UpdateFeeCollectionDto } from './dto/update-fee-collection.dto';
import { BalanceStatus } from '../student-balance/enums/student-balance.enum';

@Injectable()
export class FeeCollectionService {
  constructor(
    @InjectRepository(FeeCollection)
    private readonly repo: Repository<FeeCollection>,
    @InjectRepository(Student)
    private readonly studentRepo: Repository<Student>,
    @InjectRepository(FeeStructure)
    private readonly feeStructureRepo: Repository<FeeStructure>,
    @InjectRepository(StudentBalance)
    private readonly balanceRepo: Repository<StudentBalance>,
  ) {}

  async create(dto: CreateFeeCollectionDto): Promise<FeeCollection> {
    // Verify student exists
    const student = await this.studentRepo.findOne({ where: { studentId: dto.studentId } });
    if (!student) throw new NotFoundException(`Student "${dto.studentId}" not found.`);

    // Verify fee structure exists
    const feeStructure = await this.feeStructureRepo.findOne({ where: { id: dto.feeStructureId } });
    if (!feeStructure) throw new NotFoundException(`Fee structure "${dto.feeStructureId}" not found.`);

    // Check duplicate receipt number
    const existing = await this.repo.findOne({ where: { receiptNumber: dto.receiptNumber } });
    if (existing) throw new ConflictException(`Receipt number "${dto.receiptNumber}" already exists.`);

    const { studentId, feeStructureId, ...rest } = dto;
    const collection = this.repo.create({ ...rest, student, feeStructure });
    const saved = await this.repo.save(collection);

    // Auto-update student balance
    await this.updateStudentBalance(student, dto.amountPaid, dto.paymentDate);

    return saved;
  }

  private async updateStudentBalance(student: Student, amountPaid: number, paymentDate: string): Promise<void> {
    let balance = await this.balanceRepo.findOne({ where: { student: { id: student.id } } });

    if (!balance) {
      // Create new balance record
      balance = this.balanceRepo.create({
        student,
        totalFees: 0,
        totalPaid: amountPaid,
        balance: -amountPaid,
        lastPaymentDate: paymentDate,
        status: BalanceStatus.PARTIAL,
      });
    } else {
      balance.totalPaid = Number(balance.totalPaid) + Number(amountPaid);
      balance.balance = Number(balance.totalFees) - Number(balance.totalPaid);
      balance.lastPaymentDate = paymentDate;
      balance.status =
        balance.balance <= 0
          ? BalanceStatus.PAID
          : balance.totalPaid > 0
          ? BalanceStatus.PARTIAL
          : BalanceStatus.UNPAID;
    }

    await this.balanceRepo.save(balance);
  }

  async findAll(): Promise<FeeCollection[]> {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<FeeCollection> {
    const record = await this.repo.findOne({ where: { id } });
    if (!record) throw new NotFoundException(`Fee collection "${id}" not found.`);
    return record;
  }

  async findByStudent(studentId: string): Promise<FeeCollection[]> {
    const student = await this.studentRepo.findOne({ where: { studentId } });
    if (!student) throw new NotFoundException(`Student "${studentId}" not found.`);
    return this.repo.find({ where: { student: { id: student.id } }, order: { paymentDate: 'DESC' } });
  }

  async findByReceipt(receiptNumber: string): Promise<FeeCollection> {
    const record = await this.repo.findOne({ where: { receiptNumber } });
    if (!record) throw new NotFoundException(`Receipt "${receiptNumber}" not found.`);
    return record;
  }

  async update(id: string, dto: UpdateFeeCollectionDto): Promise<FeeCollection> {
    const record = await this.findOne(id);
    if (dto.receiptNumber && dto.receiptNumber !== record.receiptNumber) {
      const existing = await this.repo.findOne({ where: { receiptNumber: dto.receiptNumber } });
      if (existing) throw new ConflictException(`Receipt number "${dto.receiptNumber}" already exists.`);
    }
    const { studentId, feeStructureId, ...rest } = dto;
    Object.assign(record, rest);
    return this.repo.save(record);
  }

  async remove(id: string): Promise<{ message: string }> {
    const record = await this.findOne(id);
    await this.repo.remove(record);
    return { message: `Fee collection record deleted successfully.` };
  }
}