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
import { TeacherService } from './teacher.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';

@ApiTags('Teachers')
@Controller('teachers')
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Register a new teacher',
    description:
      'Creates a new teacher record. Password is hashed before storage and ' +
      'will never be returned in any response. ' +
      'teacherId, email, staffNumber, and username must all be unique.',
  })
  @ApiBody({ type: CreateTeacherDto })
  @ApiResponse({ status: 201, description: 'Teacher registered successfully.' })
  @ApiResponse({ status: 400, description: 'Validation error.' })
  @ApiResponse({ status: 409, description: 'Duplicate teacherId, email, staffNumber, or username.' })
  create(@Body() dto: CreateTeacherDto) {
    return this.teacherService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all teachers',
    description: 'Returns a list of all teachers. Password field is excluded from all responses.',
  })
  @ApiResponse({ status: 200, description: 'List of teachers returned successfully.' })
  findAll() {
    return this.teacherService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a single teacher by UUID',
    description: 'Fetches the full profile of a teacher using their system UUID.',
  })
  @ApiParam({ name: 'id', description: 'System UUID of the teacher', example: 'a3f1c2d4-1234-5678-abcd-ef0123456789' })
  @ApiResponse({ status: 200, description: 'Teacher found and returned.' })
  @ApiResponse({ status: 404, description: 'Teacher not found.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.teacherService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a teacher record',
    description:
      'Partially updates an existing teacher. All fields are optional. ' +
      'If password is updated, it will be re-hashed automatically.',
  })
  @ApiParam({ name: 'id', description: 'UUID of the teacher to update', example: 'a3f1c2d4-1234-5678-abcd-ef0123456789' })
  @ApiBody({ type: UpdateTeacherDto })
  @ApiResponse({ status: 200, description: 'Teacher updated successfully.' })
  @ApiResponse({ status: 400, description: 'Validation error.' })
  @ApiResponse({ status: 404, description: 'Teacher not found.' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTeacherDto,
  ) {
    return this.teacherService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a teacher',
    description: 'Permanently removes a teacher record from the system.',
  })
  @ApiParam({ name: 'id', description: 'UUID of the teacher to delete', example: 'a3f1c2d4-1234-5678-abcd-ef0123456789' })
  @ApiResponse({
    status: 200,
    description: 'Teacher deleted successfully.',
    schema: { example: { message: 'Teacher "TCH-2024-001" deleted successfully.' } },
  })
  @ApiResponse({ status: 404, description: 'Teacher not found.' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.teacherService.remove(id);
  }
}