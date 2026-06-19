import { PartialType } from '@nestjs/swagger';
import { CreateStudentDto } from './create-student.dto';

/**
 * All fields from CreateStudentDto are optional for updates.
 * Swagger will still show all fields with their descriptions and examples.
 */
export class UpdateStudentDto extends PartialType(CreateStudentDto) {}
