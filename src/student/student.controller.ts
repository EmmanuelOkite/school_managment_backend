import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Student } from './student.entity';

@ApiTags('Students')
@Controller('students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  // ─── CREATE ──────────────────────────────────────────────────────────────────

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new student',
    description:
      'Registers a new student in the system. ' +
      'If the student level is **A Level**, the `subjectCombination` field is **required**. ' +
      'For **O Level** students, `subjectCombination` must be omitted.',
  })
  @ApiBody({ type: CreateStudentDto })
  @ApiResponse({
    status: 201,
    description: 'Student created successfully.',
    type: Student,
  })
  @ApiResponse({ status: 400, description: 'Validation error or bad input.' })
  @ApiResponse({
    status: 409,
    description: 'A student with the given studentId already exists.',
  })
  create(@Body() dto: CreateStudentDto): Promise<Student> {
    return this.studentService.create(dto);
  }

  // ─── GET ALL ─────────────────────────────────────────────────────────────────

  @Get()
  @ApiOperation({
    summary: 'Retrieve all students',
    description: 'Returns a list of all registered students, newest first.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of students returned successfully.',
    type: [Student],
  })
  findAll(): Promise<Student[]> {
    return this.studentService.findAll();
  }

  // ─── GET ONE ─────────────────────────────────────────────────────────────────

  @Get(':id')
  @ApiOperation({
    summary: 'Retrieve a single student by UUID',
    description: 'Fetches the full profile of a student using their system UUID.',
  })
  @ApiParam({
    name: 'id',
    description: 'The system-generated UUID of the student',
    example: 'a3f1c2d4-1234-5678-abcd-ef0123456789',
  })
  @ApiResponse({
    status: 200,
    description: 'Student found and returned.',
    type: Student,
  })
  @ApiResponse({ status: 404, description: 'Student not found.' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Student> {
    return this.studentService.findOne(id);
  }

  // ─── UPDATE ──────────────────────────────────────────────────────────────────

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a student record',
    description:
      'Partially updates an existing student. All fields are optional. ' +
      'If `level` is changed to **A Level**, `subjectCombination` must be present ' +
      'either in the request body or already saved on the record. ' +
      'If `level` is changed to **O Level**, any existing `subjectCombination` is automatically cleared.',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID of the student to update',
    example: 'a3f1c2d4-1234-5678-abcd-ef0123456789',
  })
  @ApiBody({ type: UpdateStudentDto })
  @ApiResponse({
    status: 200,
    description: 'Student updated successfully.',
    type: Student,
  })
  @ApiResponse({ status: 400, description: 'Validation error.' })
  @ApiResponse({ status: 404, description: 'Student not found.' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateStudentDto,
  ): Promise<Student> {
    return this.studentService.update(id, dto);
  }

  // ─── DELETE ──────────────────────────────────────────────────────────────────

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a student',
    description: 'Permanently removes a student record from the system.',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID of the student to delete',
    example: 'a3f1c2d4-1234-5678-abcd-ef0123456789',
  })
  @ApiResponse({
    status: 200,
    description: 'Student deleted successfully.',
    schema: {
      example: { message: 'Student "STU-2024-001" deleted successfully.' },
    },
  })
  @ApiResponse({ status: 404, description: 'Student not found.' })
  remove(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ message: string }> {
    return this.studentService.remove(id);
  }
}