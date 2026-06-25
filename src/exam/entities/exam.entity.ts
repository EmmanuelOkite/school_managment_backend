import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Teacher } from '../../teacher/entities/teacher.entity';
import { ExamStatus, Term, GradingScale } from '../enums/exam.enum';

@Entity('exams')
export class Exam {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // ── Basic Exam Information ──────────────────────────────────────────────────

  @Column()
  examName!: string;

  @Column({ unique: true })
  examCode!: string;

  @Column({ nullable: true, type: 'text' })
  description?: string;

  @Column()
  academicYear!: string;

  @Column({ type: 'enum', enum: Term })
  term!: Term;

  // ── Academic Details ────────────────────────────────────────────────────────

  @Column()
  class!: string;

  @Column({ nullable: true })
  stream?: string;

  @Column()
  subject!: string;

  @ManyToOne(() => Teacher, { eager: true, nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'teacherId' })
  teacher!: Teacher;

  // ── Schedule Information ────────────────────────────────────────────────────

  @Column({ type: 'date' })
  examDate!: string;

  @Column({ type: 'time' })
  startTime!: string;

  @Column({ type: 'time' })
  endTime!: string;

  @Column()
  durationMinutes!: number;

  // ── Marks & Grading ─────────────────────────────────────────────────────────

  @Column()
  totalMarks!: number;

  @Column()
  passMark!: number;

  @Column({ type: 'enum', enum: GradingScale })
  gradingScale!: GradingScale;

  @Column({ nullable: true, type: 'decimal', precision: 5, scale: 2 })
  weightPercentage?: number;

  // ── Location Information ────────────────────────────────────────────────────

  @Column()
  examinationRoom!: string;

  @Column({ nullable: true })
  invigilator?: string;

  // ── Status ──────────────────────────────────────────────────────────────────

  @Column({ type: 'enum', enum: ExamStatus, default: ExamStatus.DRAFT })
  status!: ExamStatus;

  // ── Additional Information ──────────────────────────────────────────────────

  @Column({ nullable: true, type: 'text' })
  instructions?: string;

  @Column({ nullable: true })
  attachment?: string;

  @Column({ nullable: true, type: 'text' })
  remarks?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}