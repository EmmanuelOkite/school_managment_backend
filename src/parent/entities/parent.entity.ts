import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Student } from '../../student/entities/student.entity';
import { Relationship } from '../enums/parent.enum';

@Entity('parents')
export class Parent {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column()
  phoneNumber!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ type: 'date' })
  dateOfBirth!: string;

  @Column()
  placeOfBirth!: string;

  @Column({ type: 'enum', enum: Relationship })
  relationship!: Relationship;

  // ── Link to Student ─────────────────────────────────────────────────────────
  // A student can have multiple parents/guardians
  // A parent must be linked to an existing student
  @ManyToOne(() => Student, { eager: true, nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'studentId' })
  student!: Student;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}