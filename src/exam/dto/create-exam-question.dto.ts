import { IsString, IsNotEmpty, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateExamQuestionDto {
  @ApiProperty({ description: 'The question text', example: 'What is the capital of Uganda?' })
  @IsString()
  @IsNotEmpty()
  text!: string;

  @ApiProperty({ description: 'Marks awarded for this question', example: 5 })
  @IsInt()
  @Min(1)
  marks!: number;
}
