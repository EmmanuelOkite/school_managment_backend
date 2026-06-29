import { IsNumber, IsOptional, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateStudentBalanceDto {
  @ApiPropertyOptional({ description: 'Override total fees expected for this student', example: 1700000 })
  @IsOptional() @IsNumber() @Min(0)
  totalFees?: number;
}