import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Exam } from './exam.entity';

@Entity('exam_questions')
export class ExamQuestion {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Exam, (exam) => exam.questions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'examId' })
  exam!: Exam;

  @Column({ type: 'text' })
  text!: string;

  @Column()
  marks!: number;

  // Preserves the order questions were entered in, since insertion order
  // into the DB isn't guaranteed to be returned consistently.
  @Column()
  order!: number;

  @CreateDateColumn()
  createdAt!: Date;
}
