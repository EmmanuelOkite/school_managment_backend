import { IsString, IsEnum, IsNumber, IsDateString, IsOptional, IsNotEmpty, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { FeeCategory, FeeStructureStatus, Currency } from '../enums/fee-structure.enum';

export class CreateFeeStructureDto {
  @ApiProperty({ description: 'Academic year', example: '2024/2025' })
  @IsString() @IsNotEmpty()
  academicYear!: string;

  @ApiProperty({ description: 'Term (e.g. Term 1)', example: 'Term 1' })
  @IsString() @IsNotEmpty()
  term!: string;

  @ApiProperty({ description: 'Class the fee applies to', example: 'Senior Four' })
  @IsString() @IsNotEmpty()
  classId!: string;

  @ApiProperty({ description: 'Category of the fee', enum: FeeCategory, example: FeeCategory.TUITION })
  @IsEnum(FeeCategory)
  feeCategory!: FeeCategory;

  @ApiProperty({ description: 'Amount to be paid', example: 850000, minimum: 1 })
  @IsNumber() @Min(1)
  amount!: number;

  @ApiPropertyOptional({ description: 'Currency (defaults to UGX)', enum: Currency, example: Currency.UGX })
  @IsOptional() @IsEnum(Currency)
  currency?: Currency;

  @ApiPropertyOptional({ description: 'Description of the fee', example: 'Tuition fees for Term 1' })
  @IsOptional() @IsString()
  description?: string;

  @ApiProperty({ description: 'Payment due date (YYYY-MM-DD)', example: '2024-02-15' })
  @IsDateString()
  dueDate!: string;

  @ApiPropertyOptional({ description: 'Status (defaults to Active)', enum: FeeStructureStatus, example: FeeStructureStatus.ACTIVE })
  @IsOptional() @IsEnum(FeeStructureStatus)
  status?: FeeStructureStatus;
}