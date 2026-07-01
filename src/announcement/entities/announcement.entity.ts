import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn,
} from 'typeorm';
import { AnnouncementStatus } from '../enums/dashboard.enum';

@Entity('announcements')
export class Announcement {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column({ type: 'text' })
  message!: string;

  @Column()
  postedBy!: string;

  @Column({ type: 'enum', enum: AnnouncementStatus, default: AnnouncementStatus.ACTIVE })
  status!: AnnouncementStatus;

  @Column({ type: 'date' })
  publishDate!: string;

  @Column({ type: 'date', nullable: true })
  expiryDate?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}