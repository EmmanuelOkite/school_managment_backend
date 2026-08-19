import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ClassName, EducationLevel, Term, ClassStatus } from '../enums/class.enum';

@Entity('classes')
export class Class {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // ── Basic Class Information ─────────────────────────────────────────────────

  // name/code/maxStudents below are nullable at the DB level only to let
  // pre-existing rows from earlier (renamed) schema versions pass schema
  // sync; all three stay required for new submissions via CreateClassDto.

  @Column({ type: 'enum', enum: ClassName, nullable: true })
  name?: ClassName;

  @Column({ nullable: true })
  code?: string;

  @Column({ type: 'enum', enum: EducationLevel })
  educationLevel!: EducationLevel;

  @Column()
  academicYear!: string;

  @Column({ type: 'enum', enum: Term, nullable: true })
  term?: Term;

  @Column({ nullable: true, type: 'text' })
  description?: string;

  // ── Class Management ────────────────────────────────────────────────────────

  // Nullable at the DB level so a pre-existing row from an earlier schema
  // version doesn't break schema sync; still required for new submissions
  // via CreateClassDto validation.
  @Column({ nullable: true })
  classTeacher?: string;

  @Column({ nullable: true })
  assistantClassTeacher?: string;

  @Column({ nullable: true })
  maxStudents?: number;

  @Column({ default: 0 })
  currentStudentCount!: number;

  @Column({ type: 'enum', enum: ClassStatus, default: ClassStatus.ACTIVE })
  status!: ClassStatus;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
