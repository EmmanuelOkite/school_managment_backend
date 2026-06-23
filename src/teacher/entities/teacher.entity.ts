import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  EmploymentType,
  TeacherStatus,
  TeacherRole,
  Gender,
  HighestQualification,
} from '../enums/teacher.enum';

@Entity('teachers')
export class Teacher {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // ── Personal Information ────────────────────────────────────────────────────

  @Column({ unique: true })
  teacherId!: string;

  @Column()
  firstName!: string;

  @Column({ nullable: true })
  middleName?: string;

  @Column()
  lastName!: string;

  @Column({ type: 'enum', enum: Gender })
  gender!: Gender;

  @Column({ type: 'date' })
  dateOfBirth!: string;

  @Column()
  nationality!: string;

  @Column()
  phoneNumber!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ nullable: true })
  physicalAddress?: string;

  // ── Employment Information ──────────────────────────────────────────────────

  @Column({ unique: true })
  staffNumber!: string;

  @Column({ type: 'enum', enum: EmploymentType })
  employmentType!: EmploymentType;

  @Column({ type: 'date' })
  dateOfJoining!: string;

  @Column()
  department!: string;

  @Column()
  designation!: string;

  @Column({ type: 'enum', enum: TeacherStatus, default: TeacherStatus.ACTIVE })
  status!: TeacherStatus;

  // ── Academic Information ────────────────────────────────────────────────────

  @Column({ type: 'enum', enum: HighestQualification })
  highestQualification!: HighestQualification;

  @Column()
  specialization!: string;

  @Column()
  institution!: string;

  @Column()
  yearsOfExperience!: number;

  @Column({ nullable: true })
  certifications?: string;

  // ── Teaching Information ────────────────────────────────────────────────────

  @Column('simple-array')
  subjectsTaught!: string[];

  @Column('simple-array')
  assignedClasses!: string[];

  @Column({ default: false })
  isClassTeacher!: boolean;

  // ── Emergency Contact ───────────────────────────────────────────────────────

  @Column()
  emergencyContactName!: string;

  @Column()
  emergencyContactRelationship!: string;

  @Column()
  emergencyContactPhone!: string;

  // ── System Information ──────────────────────────────────────────────────────

  @Column({ unique: true })
  username!: string;

  @Column()
  password!: string;

  @Column({ type: 'enum', enum: TeacherRole, default: TeacherRole.TEACHER })
  role!: TeacherRole;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}