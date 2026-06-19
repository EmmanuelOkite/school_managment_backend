import {
  IsString,
  IsEnum,
  IsInt,
  IsDateString,
  IsOptional,
  Min,
  Max,
  ValidateIf,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { StudentClass, StudentLevel, Gender } from '../enums/student.enum';

export class CreateStudentDto {
  @ApiProperty({
    description: 'Unique student identifier (e.g. STU-2024-001)',
    example: 'STU-2024-001',
  })
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @ApiProperty({
    description: 'Student surname / last name',
    example: 'Mukasa',
  })
  @IsString()
  @IsNotEmpty()
  surname: string;

  @ApiProperty({
    description: 'Student first name',
    example: 'Brian',
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiPropertyOptional({
    description: 'Any other names (optional)',
    example: 'John',
  })
  @IsOptional()
  @IsString()
  otherNames?: string;

  @ApiProperty({
    description: 'Class the student is in (Senior One through Senior Six)',
    enum: StudentClass,
    example: StudentClass.SENIOR_THREE,
  })
  @IsEnum(StudentClass)
  class: StudentClass;

  @ApiProperty({
    description: 'Education level — O Level or A Level',
    enum: StudentLevel,
    example: StudentLevel.A_LEVEL,
  })
  @IsEnum(StudentLevel)
  level: StudentLevel;

  @ApiPropertyOptional({
    description:
      'Subject combination — required only when level is A Level. ' +
      'Use standard combination codes, e.g. "PCM" (Physics, Chemistry, Math), ' +
      '"HEG" (History, Economics, Geography).',
    example: 'PCM',
  })
  @ValidateIf((o) => o.level === StudentLevel.A_LEVEL)
  @IsString()
  @IsNotEmpty({ message: 'subjectCombination is required for A Level students' })
  subjectCombination?: string;

  @ApiProperty({
    description: 'Age of the student in years',
    example: 17,
    minimum: 5,
    maximum: 30,
  })
  @IsInt()
  @Min(5)
  @Max(30)
  age: number;

  @ApiProperty({
    description: 'Gender of the student',
    enum: Gender,
    example: Gender.MALE,
  })
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({
    description: 'Nationality of the student',
    example: 'Ugandan',
  })
  @IsString()
  @IsNotEmpty()
  nationality: string;

  @ApiProperty({
    description: 'Date of birth in ISO 8601 format (YYYY-MM-DD)',
    example: '2007-04-15',
  })
  @IsDateString()
  dateOfBirth: string;
}