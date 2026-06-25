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
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { ExamService } from './exam.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { ExamStatus } from './enums/exam.enum';

@ApiTags('Exams')
@Controller('exams')
export class ExamController {
  constructor(private readonly examService: ExamService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new exam',
    description:
      'Creates a new exam and links it to an existing teacher using their teacher ID. ' +
      'The teacher must already exist in the database. ' +
      'Pass mark cannot exceed total marks, and end time must be after start time.',
  })
  @ApiBody({ type: CreateExamDto })
  @ApiResponse({ status: 201, description: 'Exam created successfully.' })
  @ApiResponse({ status: 400, description: 'Validation error or invalid marks/time.' })
  @ApiResponse({ status: 404, description: 'Teacher not found.' })
  @ApiResponse({ status: 409, description: 'Exam code already exists.' })
  create(@Body() dto: CreateExamDto) {
    return this.examService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all exams',
    description: 'Returns all exam records including linked teacher details, newest first.',
  })
  @ApiResponse({ status: 200, description: 'List of exams returned successfully.' })
  findAll() {
    return this.examService.findAll();
  }

  @Get('by-class/:className')
  @ApiOperation({
    summary: 'Get all exams for a specific class',
    description: 'Fetches all exams scheduled for a given class, ordered by exam date.',
  })
  @ApiParam({ name: 'className', description: 'Class name to filter by', example: 'Senior Four' })
  @ApiResponse({ status: 200, description: 'Exams for the class returned successfully.' })
  findByClass(@Param('className') className: string) {
    return this.examService.findByClass(className);
  }

  @Get('by-status')
  @ApiOperation({
    summary: 'Get all exams filtered by status',
    description: 'Fetches all exams with a specific status (Draft, Scheduled, Ongoing, Completed, Cancelled).',
  })
  @ApiQuery({ name: 'status', enum: ExamStatus, description: 'Status to filter by', example: ExamStatus.SCHEDULED })
  @ApiResponse({ status: 200, description: 'Exams filtered by status returned successfully.' })
  findByStatus(@Query('status') status: ExamStatus) {
    return this.examService.findByStatus(status);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a single exam by UUID',
    description: 'Fetches full details of an exam using its system UUID.',
  })
  @ApiParam({ name: 'id', description: 'System UUID of the exam', example: 'a3f1c2d4-1234-5678-abcd-ef0123456789' })
  @ApiResponse({ status: 200, description: 'Exam found and returned.' })
  @ApiResponse({ status: 404, description: 'Exam not found.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.examService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update an exam',
    description:
      'Partially updates an existing exam. All fields are optional. ' +
      'If teacherId is changed, the new teacher must exist. ' +
      'Pass mark and time validations are re-applied on update.',
  })
  @ApiParam({ name: 'id', description: 'UUID of the exam to update', example: 'a3f1c2d4-1234-5678-abcd-ef0123456789' })
  @ApiBody({ type: UpdateExamDto })
  @ApiResponse({ status: 200, description: 'Exam updated successfully.' })
  @ApiResponse({ status: 400, description: 'Validation error.' })
  @ApiResponse({ status: 404, description: 'Exam or teacher not found.' })
  @ApiResponse({ status: 409, description: 'Exam code already exists.' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateExamDto,
  ) {
    return this.examService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete an exam',
    description:
      'Permanently removes an exam. ' +
      'Exams with status "Ongoing" cannot be deleted.',
  })
  @ApiParam({ name: 'id', description: 'UUID of the exam to delete', example: 'a3f1c2d4-1234-5678-abcd-ef0123456789' })
  @ApiResponse({
    status: 200,
    description: 'Exam deleted successfully.',
    schema: { example: { message: 'Exam "Mid-Term Exam" (EXAM-MT-2024-S4) deleted successfully.' } },
  })
  @ApiResponse({ status: 400, description: 'Cannot delete an ongoing exam.' })
  @ApiResponse({ status: 404, description: 'Exam not found.' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.examService.remove(id);
  }
}