import {
  IsString,
  IsEnum,
  IsInt,
  IsOptional,
  IsNotEmpty,
  Matches,
  Min,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ClassName, EducationLevel, Term, ClassStatus } from '../enums/class.enum';

export class CreateClassDto {
  // ── Basic Class Information ─────────────────────────────────────────────────

  @ApiProperty({ description: 'Name of the class', enum: ClassName, example: ClassName.SENIOR_ONE })
  @IsEnum(ClassName)
  name!: ClassName;

  @ApiProperty({ description: 'Short code identifying the class', example: 'S1' })
  @IsString()
  @IsNotEmpty()
  code!: string;

  @ApiProperty({
    description: 'Education level the class belongs to',
    enum: EducationLevel,
    example: EducationLevel.O_LEVEL,
  })
  @IsEnum(EducationLevel)
  educationLevel!: EducationLevel;

  @ApiProperty({ description: 'Academic year the class runs in (4-digit year)', example: '2026' })
  @IsString()
  @Matches(/^\d{4}$/, { message: 'academicYear must be a 4-digit year, e.g. 2026' })
  academicYear!: string;

  @ApiPropertyOptional({ description: 'Academic term (optional)', enum: Term, example: Term.TERM_ONE })
  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsOptional()
  @IsEnum(Term)
  term?: Term;

  @ApiPropertyOptional({ description: 'Optional notes about the class', example: 'Science-focused stream' })
  @IsOptional()
  @IsString()
  description?: string;

  // ── Class Management ────────────────────────────────────────────────────────

  @ApiProperty({ description: "Name of the class teacher", example: 'Mr. John Kato' })
  @IsString()
  @IsNotEmpty()
  classTeacher!: string;

  @ApiPropertyOptional({ description: 'Name of the assistant class teacher (optional)', example: 'Ms. Grace Nakato' })
  @IsOptional()
  @IsString()
  assistantClassTeacher?: string;

  @ApiProperty({ description: 'Maximum number of students the class can hold', example: 120, minimum: 1 })
  @IsInt()
  @Min(1)
  maxStudents!: number;

  @ApiPropertyOptional({
    description: 'Current status of the class (defaults to Active)',
    enum: ClassStatus,
    example: ClassStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(ClassStatus)
  status?: ClassStatus;
}
