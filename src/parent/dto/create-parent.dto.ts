import {
  IsString,
  IsEnum,
  IsEmail,
  IsDateString,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Relationship } from '../enums/parent.enum';

export class CreateParentDto {
  @ApiProperty({ description: 'First name of the parent/guardian', example: 'Margaret' })
  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @ApiProperty({ description: 'Last name of the parent/guardian', example: 'Mukasa' })
  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @ApiProperty({ description: 'Phone number of the parent/guardian', example: '+256701234567' })
  @IsString()
  @IsNotEmpty()
  phoneNumber!: string;

  @ApiProperty({ description: 'Email address of the parent/guardian', example: 'margaret.mukasa@gmail.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ description: 'Date of birth of the parent/guardian (YYYY-MM-DD)', example: '1980-03-22' })
  @IsDateString()
  dateOfBirth!: string;

  @ApiProperty({ description: 'Place of birth of the parent/guardian', example: 'Kampala, Uganda' })
  @IsString()
  @IsNotEmpty()
  placeOfBirth!: string;

  @ApiProperty({
    description: 'Relationship to the student',
    enum: Relationship,
    example: Relationship.MOTHER,
  })
  @IsEnum(Relationship)
  relationship!: Relationship;

  @ApiProperty({
    description:
      'The studentId of the student this parent belongs to (e.g. STU-2024-001). ' +
      'The student must already exist in the database — if not found, the request will be rejected.',
    example: 'STU-2024-001',
  })
  @IsString()
  @IsNotEmpty()
  studentId!: string;
}