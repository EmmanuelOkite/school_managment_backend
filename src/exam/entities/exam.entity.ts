import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Teacher } from '../../teacher/entities/teacher.entity';
import { ExamQuestion } from './exam-question.entity';
import { ExamStatus, Term, ExamType } from '../enums/exam.enum';

@Entity('exams')
export class Exam {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // ── Basic Exam Information ──────────────────────────────────────────────────

  @Column()
  examName!: string;

  @Column({ unique: true })
  examCode!: string;

  @Column({ type: 'enum', enum: ExamType })
  examType!: ExamType;

  @Column()
  academicYear!: string;

  @Column({ type: 'enum', enum: Term })
  term!: Term;

  // ── Academic Details ────────────────────────────────────────────────────────

  @Column()
  class!: string;

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

  // ── Marks & Grading ─────────────────────────────────────────────────────────

  @Column()
  totalMarks!: number;

  @Column()
  passMark!: number;

  // ── Status ──────────────────────────────────────────────────────────────────

  @Column({ type: 'enum', enum: ExamStatus, default: ExamStatus.DRAFT })
  status!: ExamStatus;

  // ── Additional Information ──────────────────────────────────────────────────

  @Column({ nullable: true })
  attachment?: string;

  @Column({ nullable: true, type: 'text' })
  remarks?: string;

  @OneToMany(() => ExamQuestion, (question) => question.exam, {
    cascade: true,
    eager: true,
    orphanedRowAction: 'delete',
  })
  questions!: ExamQuestion[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}