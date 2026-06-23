import {
  IsString,
  IsEnum,
  IsInt,
  IsDateString,
  IsOptional,
  IsEmail,
  IsBoolean,
  IsArray,
  Min,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  EmploymentType,
  TeacherStatus,
  TeacherRole,
  Gender,
  HighestQualification,
} from '../enums/teacher.enum';

export class CreateTeacherDto {
  // ── Personal Information ──────────────────────────────────────────────────

  @ApiProperty({ description: 'Unique teacher/employee ID', example: 'TCH-2024-001' })
  @IsString()
  @IsNotEmpty()
  teacherId!: string;

  @ApiProperty({ description: 'First name of the teacher', example: 'Sarah' })
  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @ApiPropertyOptional({ description: 'Middle name (optional)', example: 'Grace' })
  @IsOptional()
  @IsString()
  middleName?: string;

  @ApiProperty({ description: 'Last name of the teacher', example: 'Namukasa' })
  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @ApiProperty({ description: 'Gender of the teacher', enum: Gender, example: Gender.FEMALE })
  @IsEnum(Gender)
  gender!: Gender;

  @ApiProperty({ description: 'Date of birth (YYYY-MM-DD)', example: '1990-06-15' })
  @IsDateString()
  dateOfBirth!: string;

  @ApiProperty({ description: 'Nationality of the teacher', example: 'Ugandan' })
  @IsString()
  @IsNotEmpty()
  nationality!: string;

  @ApiProperty({ description: 'Phone number', example: '+256701234567' })
  @IsString()
  @IsNotEmpty()
  phoneNumber!: string;

  @ApiProperty({ description: 'Email address (must be unique)', example: 'sarah.namukasa@school.ac.ug' })
  @IsEmail()
  email!: string;

  @ApiPropertyOptional({ description: 'Physical / residential address', example: 'Kampala, Nakawa Division' })
  @IsOptional()
  @IsString()
  physicalAddress?: string;

  // ── Employment Information ────────────────────────────────────────────────

  @ApiProperty({ description: 'Unique staff number assigned by the school', example: 'STAFF-0042' })
  @IsString()
  @IsNotEmpty()
  staffNumber!: string;

  @ApiProperty({
    description: 'Type of employment contract',
    enum: EmploymentType,
    example: EmploymentType.FULL_TIME,
  })
  @IsEnum(EmploymentType)
  employmentType!: EmploymentType;

  @ApiProperty({ description: 'Date the teacher joined the school (YYYY-MM-DD)', example: '2020-02-01' })
  @IsDateString()
  dateOfJoining!: string;

  @ApiProperty({ description: 'Department the teacher belongs to', example: 'Sciences' })
  @IsString()
  @IsNotEmpty()
  department!: string;

  @ApiProperty({ description: 'Job title or designation', example: 'Senior Teacher' })
  @IsString()
  @IsNotEmpty()
  designation!: string;

  @ApiPropertyOptional({
    description: 'Current employment status (defaults to Active)',
    enum: TeacherStatus,
    example: TeacherStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(TeacherStatus)
  status?: TeacherStatus;

  // ── Academic Information ──────────────────────────────────────────────────

  @ApiProperty({
    description: 'Highest academic qualification attained',
    enum: HighestQualification,
    example: HighestQualification.BACHELORS,
  })
  @IsEnum(HighestQualification)
  highestQualification!: HighestQualification;

  @ApiProperty({ description: 'Subject area or specialization', example: 'Mathematics' })
  @IsString()
  @IsNotEmpty()
  specialization!: string;

  @ApiProperty({ description: 'University or institution attended', example: 'Makerere University' })
  @IsString()
  @IsNotEmpty()
  institution!: string;

  @ApiProperty({ description: 'Total years of teaching experience', example: 8, minimum: 0 })
  @IsInt()
  @Min(0)
  yearsOfExperience!: number;

  @ApiPropertyOptional({
    description: 'Any professional certifications (comma-separated or descriptive)',
    example: 'UNEB Certified, Cambridge Trained',
  })
  @IsOptional()
  @IsString()
  certifications?: string;

  // ── Teaching Information ──────────────────────────────────────────────────

  @ApiProperty({
    description: 'List of subjects the teacher teaches',
    example: ['Mathematics', 'Physics'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  subjectsTaught!: string[];

  @ApiProperty({
    description: 'List of classes assigned to the teacher',
    example: ['Senior Four', 'Senior Five'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  assignedClasses!: string[];

  @ApiProperty({
    description: 'Whether this teacher is a class teacher (true/false)',
    example: false,
  })
  @IsBoolean()
  isClassTeacher!: boolean;

  // ── Emergency Contact ─────────────────────────────────────────────────────

  @ApiProperty({ description: 'Full name of the emergency contact person', example: 'John Namukasa' })
  @IsString()
  @IsNotEmpty()
  emergencyContactName!: string;

  @ApiProperty({ description: 'Relationship to the teacher', example: 'Spouse' })
  @IsString()
  @IsNotEmpty()
  emergencyContactRelationship!: string;

  @ApiProperty({ description: 'Phone number of the emergency contact', example: '+256789876543' })
  @IsString()
  @IsNotEmpty()
  emergencyContactPhone!: string;

  // ── System Information ────────────────────────────────────────────────────

  @ApiProperty({ description: 'Login username (must be unique)', example: 'sarah.namukasa' })
  @IsString()
  @IsNotEmpty()
  username!: string;

  @ApiProperty({ description: 'Login password (will be hashed before storage)', example: 'Str0ngP@ss!' })
  @IsString()
  @IsNotEmpty()
  password!: string;

  @ApiPropertyOptional({
    description: 'System role assigned to the teacher (defaults to Teacher)',
    enum: TeacherRole,
    example: TeacherRole.TEACHER,
  })
  @IsOptional()
  @IsEnum(TeacherRole)
  role?: TeacherRole;
}