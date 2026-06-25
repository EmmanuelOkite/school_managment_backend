import {
  IsString,
  IsEnum,
  IsInt,
  IsDateString,
  IsOptional,
  IsNotEmpty,
  IsNumber,
  Min,
  Max,
  Matches,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ExamStatus, Term, GradingScale } from '../enums/exam.enum';

export class CreateExamDto {
  // ── Basic Exam Information ──────────────────────────────────────────────────

  @ApiProperty({ description: 'Name of the exam', example: 'Mid-Term Exam' })
  @IsString()
  @IsNotEmpty()
  examName!: string;

  @ApiProperty({ description: 'Unique exam code for identification', example: 'EXAM-MT-2024-S4' })
  @IsString()
  @IsNotEmpty()
  examCode!: string;

  @ApiPropertyOptional({ description: 'Brief description of the exam', example: 'Mid-term examination covering chapters 1 to 5' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Academic year the exam belongs to', example: '2024/2025' })
  @IsString()
  @IsNotEmpty()
  academicYear!: string;

  @ApiProperty({ description: 'Term or semester the exam is held in', enum: Term, example: Term.TERM_ONE })
  @IsEnum(Term)
  term!: Term;

  // ── Academic Details ────────────────────────────────────────────────────────

  @ApiProperty({ description: 'Class or grade sitting the exam', example: 'Senior Four' })
  @IsString()
  @IsNotEmpty()
  class!: string;

  @ApiPropertyOptional({ description: 'Stream or section (optional)', example: 'East' })
  @IsOptional()
  @IsString()
  stream?: string;

  @ApiProperty({ description: 'Subject being examined', example: 'Mathematics' })
  @IsString()
  @IsNotEmpty()
  subject!: string;

  @ApiProperty({
    description:
      'Teacher ID of the examiner (e.g. TCH-2024-001). ' +
      'The teacher must already exist in the database.',
    example: 'TCH-2024-001',
  })
  @IsString()
  @IsNotEmpty()
  teacherId!: string;

  // ── Schedule Information ────────────────────────────────────────────────────

  @ApiProperty({ description: 'Date of the exam (YYYY-MM-DD)', example: '2024-11-15' })
  @IsDateString()
  examDate!: string;

  @ApiProperty({ description: 'Exam start time (HH:MM in 24hr format)', example: '09:00' })
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'startTime must be in HH:MM format (e.g. 09:00)' })
  startTime!: string;

  @ApiProperty({ description: 'Exam end time (HH:MM in 24hr format)', example: '12:00' })
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'endTime must be in HH:MM format (e.g. 12:00)' })
  endTime!: string;

  @ApiProperty({ description: 'Duration of the exam in minutes', example: 180 })
  @IsInt()
  @Min(10)
  durationMinutes!: number;

  // ── Marks & Grading ─────────────────────────────────────────────────────────

  @ApiProperty({ description: 'Total marks for the exam', example: 100 })
  @IsInt()
  @Min(1)
  totalMarks!: number;

  @ApiProperty({ description: 'Minimum marks required to pass', example: 50 })
  @IsInt()
  @Min(1)
  passMark!: number;

  @ApiProperty({
    description: 'Grading scale used to classify results',
    enum: GradingScale,
    example: GradingScale.MERIT,
  })
  @IsEnum(GradingScale)
  gradingScale!: GradingScale;

  @ApiPropertyOptional({
    description: 'Weight of this exam as a percentage of the overall grade (0-100)',
    example: 30,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  weightPercentage?: number;

  // ── Location Information ────────────────────────────────────────────────────

  @ApiProperty({ description: 'Room or hall where the exam will be held', example: 'Hall A' })
  @IsString()
  @IsNotEmpty()
  examinationRoom!: string;

  @ApiPropertyOptional({ description: 'Name of the invigilator (optional)', example: 'Mr. Ssebunya' })
  @IsOptional()
  @IsString()
  invigilator?: string;

  // ── Status ──────────────────────────────────────────────────────────────────

  @ApiPropertyOptional({
    description: 'Current status of the exam (defaults to Draft)',
    enum: ExamStatus,
    example: ExamStatus.DRAFT,
  })
  @IsOptional()
  @IsEnum(ExamStatus)
  status?: ExamStatus;

  // ── Additional Information ──────────────────────────────────────────────────

  @ApiPropertyOptional({
    description: 'Instructions to be given to students before the exam',
    example: 'Answer all questions in Section A and any three from Section B.',
  })
  @IsOptional()
  @IsString()
  instructions?: string;

  @ApiPropertyOptional({
    description: 'File path or URL of any attached document (e.g. exam timetable PDF)',
    example: 'uploads/exams/timetable-mt-2024.pdf',
  })
  @IsOptional()
  @IsString()
  attachment?: string;

  @ApiPropertyOptional({
    description: 'Any additional remarks or notes about the exam',
    example: 'Students must bring scientific calculators.',
  })
  @IsOptional()
  @IsString()
  remarks?: string;
}