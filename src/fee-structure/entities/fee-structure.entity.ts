import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn, OneToMany,
} from 'typeorm';
import { FeeCategory, FeeStructureStatus, Currency } from '../enums/fee-structure.enum';
import { FeeCollection } from '../../fee-collection/entities/fee-collection.entity';

@Entity('fee_structures')
export class FeeStructure {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  academicYear!: string;

  @Column()
  term!: string;

  @Column()
  classId!: string;

  @Column({ type: 'enum', enum: FeeCategory })
  feeCategory!: FeeCategory;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount!: number;

  @Column({ type: 'enum', enum: Currency, default: Currency.UGX })
  currency!: Currency;

  @Column({ nullable: true, type: 'text' })
  description?: string;

  @Column({ type: 'date' })
  dueDate!: string;

  @Column({ type: 'enum', enum: FeeStructureStatus, default: FeeStructureStatus.ACTIVE })
  status!: FeeStructureStatus;

  @OneToMany(() => FeeCollection, (fc) => fc.feeStructure)
  collections!: FeeCollection[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}