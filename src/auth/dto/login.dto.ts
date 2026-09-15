import { IsEmail, IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ description: 'Account email address', example: 'admin@school.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ description: 'Account password', example: 'StrongPassword123!' })
  @IsString()
  @IsNotEmpty()
  password!: string;
}
