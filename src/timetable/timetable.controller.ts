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
import { TimetableService } from './timetable.service';
import { CreateTimetableDto } from './dto/create-timetable.dto';
import { UpdateTimetableDto } from './dto/update-timetable.dto';
import { TimetableType, DayOfWeek } from './enums/timetable.enum';

@ApiTags('Timetables')
@Controller('timetables')
export class TimetableController {
  constructor(private readonly timetableService: TimetableService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new timetable entry',
    description:
      'Creates a timetable slot (Class, Teacher, or Exam). ' +
      'The system validates that: the teacher exists, end time is after start time, ' +
      'the slot does not overlap with an existing entry for the same teacher, class, or room on the same day. ' +
      'For Exam timetable type, examId (exam code) is required and must exist.',
  })
  @ApiBody({ type: CreateTimetableDto })
  @ApiResponse({ status: 201, description: 'Timetable entry created successfully.' })
  @ApiResponse({ status: 400, description: 'Validation error or invalid times.' })
  @ApiResponse({ status: 404, description: 'Teacher or exam not found.' })
  @ApiResponse({ status: 409, description: 'Overlapping timetable slot detected.' })
  create(@Body() dto: CreateTimetableDto) {
    return this.timetableService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all timetable entries',
    description: 'Returns all timetable entries across all types, newest first.',
  })
  @ApiResponse({ status: 200, description: 'All timetable entries returned.' })
  findAll() {
    return this.timetableService.findAll();
  }

  @Get('by-type')
  @ApiOperation({
    summary: 'Get timetable entries filtered by type',
    description: 'Filter entries by timetable type: Class, Teacher, or Exam.',
  })
  @ApiQuery({ name: 'type', enum: TimetableType, example: TimetableType.CLASS })
  @ApiResponse({ status: 200, description: 'Timetable entries for the given type returned.' })
  findByType(@Query('type') type: TimetableType) {
    return this.timetableService.findByType(type);
  }

  @Get('by-class/:classId')
  @ApiOperation({
    summary: 'Get timetable entries for a specific class',
    description: 'Returns all active timetable slots for a class, ordered by day and time.',
  })
  @ApiParam({ name: 'classId', description: 'Class name or ID', example: 'Senior Four' })
  @ApiResponse({ status: 200, description: 'Class timetable returned.' })
  findByClass(@Param('classId') classId: string) {
    return this.timetableService.findByClass(classId);
  }

  @Get('by-teacher/:teacherId')
  @ApiOperation({
    summary: 'Get timetable entries for a specific teacher',
    description: 'Returns all timetable slots assigned to a teacher, ordered by day and time.',
  })
  @ApiParam({ name: 'teacherId', description: 'Teacher ID (e.g. TCH-2024-001)', example: 'TCH-2024-001' })
  @ApiResponse({ status: 200, description: 'Teacher timetable returned.' })
  @ApiResponse({ status: 404, description: 'Teacher not found.' })
  findByTeacher(@Param('teacherId') teacherId: string) {
    return this.timetableService.findByTeacher(teacherId);
  }

  @Get('by-day')
  @ApiOperation({
    summary: 'Get all timetable entries for a specific day',
    description: 'Returns all slots scheduled on a given day of the week.',
  })
  @ApiQuery({ name: 'day', enum: DayOfWeek, example: DayOfWeek.MONDAY })
  @ApiResponse({ status: 200, description: 'Day timetable returned.' })
  findByDay(@Query('day') day: DayOfWeek) {
    return this.timetableService.findByDay(day);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a single timetable entry by UUID',
    description: 'Fetches a specific timetable entry using its system UUID.',
  })
  @ApiParam({ name: 'id', description: 'UUID of the timetable entry', example: 'a3f1c2d4-1234-5678-abcd-ef0123456789' })
  @ApiResponse({ status: 200, description: 'Timetable entry found and returned.' })
  @ApiResponse({ status: 404, description: 'Timetable entry not found.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.timetableService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a timetable entry',
    description:
      'Partially updates a timetable entry. All fields are optional. ' +
      'All overlap and validation rules are re-applied on update. ' +
      'The current entry is excluded from overlap checks.',
  })
  @ApiParam({ name: 'id', description: 'UUID of the timetable entry to update', example: 'a3f1c2d4-1234-5678-abcd-ef0123456789' })
  @ApiBody({ type: UpdateTimetableDto })
  @ApiResponse({ status: 200, description: 'Timetable entry updated successfully.' })
  @ApiResponse({ status: 400, description: 'Validation error.' })
  @ApiResponse({ status: 404, description: 'Timetable entry, teacher, or exam not found.' })
  @ApiResponse({ status: 409, description: 'Overlapping timetable slot detected.' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTimetableDto,
  ) {
    return this.timetableService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a timetable entry',
    description: 'Permanently removes a timetable entry from the system.',
  })
  @ApiParam({ name: 'id', description: 'UUID of the timetable entry to delete', example: 'a3f1c2d4-1234-5678-abcd-ef0123456789' })
  @ApiResponse({
    status: 200,
    description: 'Timetable entry deleted successfully.',
    schema: { example: { message: 'Timetable entry "Senior Four - Mathematics - Monday Morning" deleted successfully.' } },
  })
  @ApiResponse({ status: 404, description: 'Timetable entry not found.' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.timetableService.remove(id);
  }
}