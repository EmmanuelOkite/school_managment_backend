import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { StudentClass, StudentLevel, Gender } from './enums/student.enum';

@Entity('students')
export class Student {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  studentId: string;

  @Column()
  surname: string;

  @Column()
  firstName: string;

  @Column({ nullable: true })
  otherNames: string;

  @Column({ type: 'enum', enum: StudentClass })
  class: StudentClass;

  @Column({ type: 'enum', enum: StudentLevel })
  level: StudentLevel;

  /**
   * Only required when level is A_LEVEL.
   * Example: "PCM" (Physics, Chemistry, Math)
   */
  @Column({ nullable: true })
  subjectCombination: string;

  @Column()
  age: number;

  @Column({ type: 'enum', enum: Gender })
  gender: Gender;

  @Column()
  nationality: string;

  @Column({ type: 'date' })
  dateOfBirth: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}