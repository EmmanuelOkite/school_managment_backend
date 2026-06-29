import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FeeCollection } from '../fee-collection/entities/fee-collection.entity';
import { FeeStructure } from '../fee-structure/entities/fee-structure.entity';
import { StudentBalance } from '../student-balance/entities/student-balance.entity';
import { Expense } from '../expense/entities/expense.entity';

@Injectable()
export class FinancialReportService {
  constructor(
    @InjectRepository(FeeCollection)
    private readonly collectionRepo: Repository<FeeCollection>,
    @InjectRepository(FeeStructure)
    private readonly feeStructureRepo: Repository<FeeStructure>,
    @InjectRepository(StudentBalance)
    private readonly balanceRepo: Repository<StudentBalance>,
    @InjectRepository(Expense)
    private readonly expenseRepo: Repository<Expense>,
  ) {}

  async getIncomeReport() {
    const collections = await this.collectionRepo.find();
    const totalCollected = collections.reduce((sum, c) => sum + Number(c.amountPaid), 0);

    const feeStructures = await this.feeStructureRepo.find({ where: { status: 'Active' as any } });
    const totalExpected = feeStructures.reduce((sum, f) => sum + Number(f.amount), 0);

    return {
      totalExpected,
      totalCollected,
      outstanding: totalExpected - totalCollected,
      collectionRate: totalExpected > 0
        ? `${((totalCollected / totalExpected) * 100).toFixed(2)}%`
        : '0%',
    };
  }

  async getExpensesReport() {
    const expenses = await this.expenseRepo.find();
    const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

    const byCategory = expenses.reduce((acc, e) => {
      acc[e.expenseCategory] = (acc[e.expenseCategory] || 0) + Number(e.amount);
      return acc;
    }, {} as Record<string, number>);

    return { totalExpenses, byCategory, count: expenses.length };
  }

  async getBalancesReport() {
    const balances = await this.balanceRepo.find();
    const totalOutstanding = balances.reduce((sum, b) => sum + Math.max(0, Number(b.balance)), 0);
    const paid = balances.filter((b) => b.status === 'Paid').length;
    const partial = balances.filter((b) => b.status === 'Partial').length;
    const unpaid = balances.filter((b) => b.status === 'Unpaid').length;

    return {
      totalStudents: balances.length,
      totalOutstanding,
      paid,
      partial,
      unpaid,
    };
  }

  async getMonthlyReport() {
    const collections = await this.collectionRepo.find();
    const expenses = await this.expenseRepo.find();

    const monthly: Record<string, { collected: number; expenses: number; net: number }> = {};

    for (const c of collections) {
      const month = c.paymentDate.substring(0, 7);
      if (!monthly[month]) monthly[month] = { collected: 0, expenses: 0, net: 0 };
      monthly[month].collected += Number(c.amountPaid);
    }

    for (const e of expenses) {
      const month = e.expenseDate.substring(0, 7);
      if (!monthly[month]) monthly[month] = { collected: 0, expenses: 0, net: 0 };
      monthly[month].expenses += Number(e.amount);
    }

    for (const month of Object.keys(monthly)) {
      monthly[month].net = monthly[month].collected - monthly[month].expenses;
    }

    return Object.entries(monthly)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, data]) => ({ month, ...data }));
  }

  async getAnnualReport() {
    const monthly = await this.getMonthlyReport();
    const totalCollected = monthly.reduce((s, m) => s + m.collected, 0);
    const totalExpenses = monthly.reduce((s, m) => s + m.expenses, 0);

    return {
      totalCollected,
      totalExpenses,
      netIncome: totalCollected - totalExpenses,
      months: monthly,
    };
  }

  async getStudentReport(studentId: string) {
    const payments = await this.collectionRepo.find({
      where: { student: { studentId } },
      order: { paymentDate: 'DESC' },
    });

    const balance = await this.balanceRepo.findOne({
      where: { student: { studentId } },
    });

    const totalPaid = payments.reduce((sum, p) => sum + Number(p.amountPaid), 0);

    return {
      studentId,
      totalPaid,
      paymentCount: payments.length,
      balance: balance ?? null,
      payments,
    };
  }
}