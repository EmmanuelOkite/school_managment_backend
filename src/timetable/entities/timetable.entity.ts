import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TimetableType, DayOfWeek, TimetableStatus } from '../enums/timetable.enum';
import { Teacher } from '../../teacher/entities/teacher.entity';
import { Student } from '../../student/entities/student.entity';
import { Exam } from '../../exam/entities/exam.entity';

@Entity('timetables')
export class Timetable {
  @PrimaryGeneratedColumn('uuid')
  timetableId!: string;

  @Column({ type: 'enum', enum: TimetableType })
  timetableType!: TimetableType;

  @Column()
  title!: string;

  @Column()
  academicYear!: string;

  @Column()
  term!: string;

  // ── Class reference (using studentId's class field as a string reference) ───
  @Column()
  classId!: string;

  @Column({ nullable: true })
  streamId?: string;

  // ── Teacher reference ────────────────────────────────────────────────────────
  @ManyToOne(() => Teacher, { eager: true, nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'teacherRefId' })
  teacher!: Teacher;

  // ── Subject (stored as string — can be linked to a Subject entity later) ─────
  @Column()
  subjectId!: string;

  // ── Exam reference (only for Exam timetable type) ────────────────────────────
  @ManyToOne(() => Exam, { eager: true, nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'examRefId' })
  exam?: Exam;

  @Column({ type: 'enum', enum: DayOfWeek })
  dayOfWeek!: DayOfWeek;

  @Column({ type: 'time' })
  startTime!: string;

  @Column({ type: 'time' })
  endTime!: string;

  @Column()
  room!: string;

  @Column({ type: 'enum', enum: TimetableStatus, default: TimetableStatus.ACTIVE })
  status!: TimetableStatus;

  @Column({ nullable: true, type: 'text' })
  remarks?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}