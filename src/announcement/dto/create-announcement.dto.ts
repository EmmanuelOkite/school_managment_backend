import { IsString, IsEnum, IsDateString, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AnnouncementStatus } from '../enums/dashboard.enum';

export class CreateAnnouncementDto {
  @ApiProperty({ description: 'Title of the announcement', example: 'School Closure Notice' })
  @IsString() @IsNotEmpty()
  title!: string;

  @ApiProperty({ description: 'Full message body of the announcement', example: 'The school will be closed on 15th February 2024 due to a public holiday.' })
  @IsString() @IsNotEmpty()
  message!: string;

  @ApiProperty({ description: 'Name of the staff member posting the announcement', example: 'Mr. Kato, Headteacher' })
  @IsString() @IsNotEmpty()
  postedBy!: string;

  @ApiPropertyOptional({ description: 'Visibility status (defaults to Active)', enum: AnnouncementStatus, example: AnnouncementStatus.ACTIVE })
  @IsOptional() @IsEnum(AnnouncementStatus)
  status?: AnnouncementStatus;

  @ApiProperty({ description: 'Date the announcement goes live (YYYY-MM-DD)', example: '2024-02-10' })
  @IsDateString()
  publishDate!: string;

  @ApiPropertyOptional({ description: 'Date the announcement expires and is no longer shown (YYYY-MM-DD)', example: '2024-02-16' })
  @IsOptional() @IsDateString()
  expiryDate?: string;
}