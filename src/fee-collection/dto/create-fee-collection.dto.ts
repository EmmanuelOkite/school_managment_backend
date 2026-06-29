import { IsString, IsEnum, IsNumber, IsDateString, IsOptional, IsNotEmpty, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentMethod } from '../enums/fee-collection.enum';

export class CreateFeeCollectionDto {
  @ApiProperty({ description: 'Student ID (e.g. STU-2024-001)', example: 'STU-2024-001' })
  @IsString() @IsNotEmpty()
  studentId!: string;

  @ApiProperty({ description: 'UUID of the fee structure this payment is for', example: 'uuid-here' })
  @IsString() @IsNotEmpty()
  feeStructureId!: string;

  @ApiProperty({ description: 'Unique receipt number', example: 'RCP-2024-00123' })
  @IsString() @IsNotEmpty()
  receiptNumber!: string;

  @ApiProperty({ description: 'Amount paid (must be positive)', example: 850000, minimum: 1 })
  @IsNumber() @Min(1)
  amountPaid!: number;

  @ApiProperty({ description: 'Payment method used', enum: PaymentMethod, example: PaymentMethod.CASH })
  @IsEnum(PaymentMethod)
  paymentMethod!: PaymentMethod;

  @ApiProperty({ description: 'Date of payment (YYYY-MM-DD)', example: '2024-02-10' })
  @IsDateString()
  paymentDate!: string;

  @ApiPropertyOptional({ description: 'Transaction reference or mobile money code', example: 'TXN-MTN-789456' })
  @IsOptional() @IsString()
  transactionReference?: string;

  @ApiProperty({ description: 'Name of staff who received the payment', example: 'Mr. Kato' })
  @IsString() @IsNotEmpty()
  receivedBy!: string;

  @ApiPropertyOptional({ description: 'Additional remarks', example: 'Partial payment for Term 1' })
  @IsOptional() @IsString()
  remarks?: string;
}