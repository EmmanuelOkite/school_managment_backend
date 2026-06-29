import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Expense } from './entities/expense.entity';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { ExpenseCategory } from './enums/expense.enum';

@Injectable()
export class ExpenseService {
  constructor(
    @InjectRepository(Expense)
    private readonly repo: Repository<Expense>,
  ) {}

  async create(dto: CreateExpenseDto): Promise<Expense> {
    return this.repo.save(this.repo.create(dto));
  }

  async findAll(): Promise<Expense[]> {
    return this.repo.find({ order: { expenseDate: 'DESC' } });
  }

  async findOne(id: string): Promise<Expense> {
    const record = await this.repo.findOne({ where: { id } });
    if (!record) throw new NotFoundException(`Expense "${id}" not found.`);
    return record;
  }

  async findByCategory(expenseCategory: ExpenseCategory): Promise<Expense[]> {
    return this.repo.find({ where: { expenseCategory }, order: { expenseDate: 'DESC' } });
  }

  async findByMonth(month: string): Promise<Expense[]> {
    // month format: YYYY-MM
    return this.repo
      .createQueryBuilder('expense')
      .where("TO_CHAR(expense.expenseDate, 'YYYY-MM') = :month", { month })
      .orderBy('expense.expenseDate', 'ASC')
      .getMany();
  }

  async update(id: string, dto: UpdateExpenseDto): Promise<Expense> {
    const record = await this.findOne(id);
    Object.assign(record, dto);
    return this.repo.save(record);
  }

  async remove(id: string): Promise<{ message: string }> {
    const record = await this.findOne(id);
    await this.repo.remove(record);
    return { message: `Expense "${record.expenseTitle}" deleted successfully.` };
  }
}