import {
  Entity, PrimaryGeneratedColumn, Column,
  OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn,
} from 'typeorm';
import { Student } from '../../student/entities/student.entity';
import { BalanceStatus } from '../enums/student-balance.enum';

@Entity('student_balances')
export class StudentBalance {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @OneToOne(() => Student, { eager: true, nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'studentRefId' })
  student!: Student;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  totalFees!: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  totalPaid!: number;

  // balance = totalFees - totalPaid (computed and stored)
  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  balance!: number;

  @Column({ type: 'date', nullable: true })
  lastPaymentDate?: string;

  @Column({ type: 'enum', enum: BalanceStatus, default: BalanceStatus.UNPAID })
  status!: BalanceStatus;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}