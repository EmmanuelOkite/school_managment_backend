import { IsString, IsEnum, IsNumber, IsDateString, IsOptional, IsNotEmpty, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ExpenseCategory, ExpenseStatus, ExpensePaymentMethod } from '../enums/expense.enum';

export class CreateExpenseDto {
  @ApiProperty({ description: 'Category of the expense', enum: ExpenseCategory, example: ExpenseCategory.UTILITIES })
  @IsEnum(ExpenseCategory)
  expenseCategory!: ExpenseCategory;

  @ApiProperty({ description: 'Title or name of the expense', example: 'Electricity Bill - January 2024' })
  @IsString() @IsNotEmpty()
  expenseTitle!: string;

  @ApiPropertyOptional({ description: 'Detailed description', example: 'UMEME electricity bill for January' })
  @IsOptional() @IsString()
  description?: string;

  @ApiProperty({ description: 'Amount of the expense (must be positive)', example: 450000, minimum: 1 })
  @IsNumber() @Min(1)
  amount!: number;

  @ApiProperty({ description: 'Payment method', enum: ExpensePaymentMethod, example: ExpensePaymentMethod.BANK })
  @IsEnum(ExpensePaymentMethod)
  paymentMethod!: ExpensePaymentMethod;

  @ApiProperty({ description: 'Date of the expense (YYYY-MM-DD)', example: '2024-01-31' })
  @IsDateString()
  expenseDate!: string;

  @ApiPropertyOptional({ description: 'Vendor or supplier name', example: 'UMEME Ltd' })
  @IsOptional() @IsString()
  vendor?: string;

  @ApiPropertyOptional({ description: 'Receipt or invoice number', example: 'INV-2024-0045' })
  @IsOptional() @IsString()
  receiptNumber?: string;

  @ApiProperty({ description: 'Staff member who recorded the expense', example: 'Mr. Ssekandi' })
  @IsString() @IsNotEmpty()
  recordedBy!: string;

  @ApiPropertyOptional({ description: 'Payment status (defaults to Pending)', enum: ExpenseStatus, example: ExpenseStatus.PAID })
  @IsOptional() @IsEnum(ExpenseStatus)
  status?: ExpenseStatus;
}