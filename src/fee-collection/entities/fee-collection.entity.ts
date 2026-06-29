import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn,
} from 'typeorm';
import { PaymentMethod } from '../enums/fee-collection.enum';
import { Student } from '../../student/entities/student.entity';
import { FeeStructure } from '../../fee-structure/entities/fee-structure.entity';

@Entity('fee_collections')
export class FeeCollection {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Student, { eager: true, nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'studentRefId' })
  student!: Student;

  @ManyToOne(() => FeeStructure, (fs) => fs.collections, { eager: true, nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'feeStructureRefId' })
  feeStructure!: FeeStructure;

  @Column({ unique: true })
  receiptNumber!: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amountPaid!: number;

  @Column({ type: 'enum', enum: PaymentMethod })
  paymentMethod!: PaymentMethod;

  @Column({ type: 'date' })
  paymentDate!: string;

  @Column({ nullable: true })
  transactionReference?: string;

  @Column()
  receivedBy!: string;

  @Column({ nullable: true, type: 'text' })
  remarks?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}