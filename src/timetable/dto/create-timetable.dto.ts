import {
  IsString,
  IsEnum,
  IsOptional,
  IsNotEmpty,
  ValidateIf,
  Matches,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TimetableType, DayOfWeek, TimetableStatus } from '../enums/timetable.enum';

export class CreateTimetableDto {
  @ApiProperty({
    description: 'Type of timetable',
    enum: TimetableType,
    example: TimetableType.CLASS,
  })
  @IsEnum(TimetableType)
  timetableType!: TimetableType;

  @ApiProperty({
    description: 'Title or label for this timetable entry',
    example: 'Senior Four - Mathematics - Monday Morning',
  })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({ description: 'Academic year', example: '2024/2025' })
  @IsString()
  @IsNotEmpty()
  academicYear!: string;

  @ApiProperty({ description: 'Term for this timetable entry', example: 'Term 1' })
  @IsString()
  @IsNotEmpty()
  term!: string;

  @ApiProperty({
    description: 'Class identifier (e.g. "Senior Four")',
    example: 'Senior Four',
  })
  @IsString()
  @IsNotEmpty()
  classId!: string;

  @ApiPropertyOptional({
    description: 'Stream or section (optional)',
    example: 'East',
  })
  @IsOptional()
  @IsString()
  streamId?: string;

  @ApiProperty({
    description:
      'Teacher ID of the assigned teacher (e.g. TCH-2024-001). ' +
      'Must reference an existing teacher in the database.',
    example: 'TCH-2024-001',
  })
  @IsString()
  @IsNotEmpty()
  teacherId!: string;

  @ApiProperty({
    description: 'Subject identifier (e.g. "Mathematics")',
    example: 'Mathematics',
  })
  @IsString()
  @IsNotEmpty()
  subjectId!: string;

  @ApiPropertyOptional({
    description:
      'Exam code of the linked exam (e.g. EXAM-MT-2024-S4). ' +
      'Required when timetableType is "Exam". Must reference an existing exam.',
    example: 'EXAM-MT-2024-S4',
  })
  @ValidateIf((o) => o.timetableType === TimetableType.EXAM)
  @IsString()
  @IsNotEmpty({ message: 'examId is required for Exam timetable type' })
  examId?: string;

  @ApiProperty({
    description: 'Day of the week for this timetable slot',
    enum: DayOfWeek,
    example: DayOfWeek.MONDAY,
  })
  @IsEnum(DayOfWeek)
  dayOfWeek!: DayOfWeek;

  @ApiProperty({
    description: 'Start time of the slot (HH:MM in 24hr format)',
    example: '08:00',
  })
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'startTime must be in HH:MM format (e.g. 08:00)',
  })
  startTime!: string;

  @ApiProperty({
    description: 'End time of the slot (HH:MM in 24hr format)',
    example: '09:00',
  })
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'endTime must be in HH:MM format (e.g. 09:00)',
  })
  endTime!: string;

  @ApiProperty({
    description: 'Room or hall assigned for this slot',
    example: 'Room 12',
  })
  @IsString()
  @IsNotEmpty()
  room!: string;

  @ApiPropertyOptional({
    description: 'Status of the timetable entry (defaults to Active)',
    enum: TimetableStatus,
    example: TimetableStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(TimetableStatus)
  status?: TimetableStatus;

  @ApiPropertyOptional({
    description: 'Any additional remarks or notes',
    example: 'Double period — bring textbooks.',
  })
  @IsOptional()
  @IsString()
  remarks?: string;
}