import {
  IsString,
  IsEnum,
  IsInt,
  IsDateString,
  IsOptional,
  IsNotEmpty,
  IsArray,
  ValidateNested,
  Min,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ExamStatus, Term, ExamType } from '../enums/exam.enum';
import { CreateExamQuestionDto } from './create-exam-question.dto';

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

  @ApiProperty({ description: 'Type of exam', enum: ExamType, example: ExamType.MIDTERM })
  @IsEnum(ExamType)
  examType!: ExamType;

  @ApiProperty({ description: 'Academic year the exam belongs to (4-digit year)', example: '2026' })
  @IsString()
  @Matches(/^\d{4}$/, { message: 'academicYear must be a 4-digit year (e.g. 2026)' })
  academicYear!: string;

  @ApiProperty({ description: 'Term or semester the exam is held in', enum: Term, example: Term.TERM_ONE })
  @IsEnum(Term)
  term!: Term;

  // ── Academic Details ────────────────────────────────────────────────────────

  @ApiProperty({ description: 'Class or grade sitting the exam', example: 'Senior Four' })
  @IsString()
  @IsNotEmpty()
  class!: string;

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

  // ── Marks & Grading ─────────────────────────────────────────────────────────

  @ApiProperty({ description: 'Total marks for the exam', example: 100 })
  @IsInt()
  @Min(1)
  totalMarks!: number;

  @ApiProperty({ description: 'Minimum marks required to pass', example: 50 })
  @IsInt()
  @Min(1)
  passMark!: number;

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

  // ── Question Paper ───────────────────────────────────────────────────────────

  @ApiPropertyOptional({
    description: 'Question paper for this exam (optional). On update, sending this replaces the exam\'s entire question set.',
    type: [CreateExamQuestionDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateExamQuestionDto)
  questions?: CreateExamQuestionDto[];
}
