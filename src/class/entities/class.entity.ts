import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EducationLevel, Term, ClassStatus } from '../enums/class.enum';
import { Teacher } from '../../teacher/entities/teacher.entity';

@Entity('classes')
export class Class {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // ── Basic Class Information ─────────────────────────────────────────────────

  @Column()
  className!: string;

  @Column()
  classCode!: string;

  @Column({ type: 'enum', enum: EducationLevel })
  educationLevel!: EducationLevel;

  @Column()
  academicYear!: string;

  @Column({ type: 'enum', enum: Term, nullable: true })
  term?: Term;

  @Column({ nullable: true, type: 'text' })
  description?: string;

  // ── Class Management ────────────────────────────────────────────────────────

  @ManyToOne(() => Teacher, { eager: true, nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'classTeacherRefId' })
  classTeacher!: Teacher;

  @ManyToOne(() => Teacher, { eager: true, nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'assistantClassTeacherRefId' })
  assistantClassTeacher?: Teacher;

  @Column()
  maximumStudents!: number;

  @Column({ default: 0 })
  currentStudentCount!: number;

  @Column({ type: 'enum', enum: ClassStatus, default: ClassStatus.ACTIVE })
  status!: ClassStatus;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
