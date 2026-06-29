import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ExpenseCategory, ExpenseStatus, ExpensePaymentMethod } from '../enums/expense.enum';

@Entity('expenses')
export class Expense {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'enum', enum: ExpenseCategory })
  expenseCategory!: ExpenseCategory;

  @Column()
  expenseTitle!: string;

  @Column({ nullable: true, type: 'text' })
  description?: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount!: number;

  @Column({ type: 'enum', enum: ExpensePaymentMethod })
  paymentMethod!: ExpensePaymentMethod;

  @Column({ type: 'date' })
  expenseDate!: string;

  @Column({ nullable: true })
  vendor?: string;

  @Column({ nullable: true })
  receiptNumber?: string;

  @Column()
  recordedBy!: string;

  @Column({ type: 'enum', enum: ExpenseStatus, default: ExpenseStatus.PENDING })
  status!: ExpenseStatus;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}