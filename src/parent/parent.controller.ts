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
import { ParentService } from './parent.service';
import { CreateParentDto } from './dto/create-parent.dto';
import { UpdateParentDto } from './dto/update-parent.dto';

@ApiTags('Parents')
@Controller('parents')
export class ParentController {
  constructor(private readonly parentService: ParentService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Add a new parent/guardian',
    description:
      'Registers a parent and links them to an existing student using the student\'s ID ' +
      '(e.g. STU-2024-001). If the student does not exist in the database, ' +
      'the request will be rejected with a 404 error.',
  })
  @ApiBody({ type: CreateParentDto })
  @ApiResponse({ status: 201, description: 'Parent added and linked to student successfully.' })
  @ApiResponse({ status: 400, description: 'Validation error.' })
  @ApiResponse({ status: 404, description: 'Student not found — parent cannot be added.' })
  @ApiResponse({ status: 409, description: 'Email already registered.' })
  create(@Body() dto: CreateParentDto) {
    return this.parentService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all parents',
    description: 'Returns all parent records including their linked student details.',
  })
  @ApiResponse({ status: 200, description: 'List of parents returned successfully.' })
  findAll() {
    return this.parentService.findAll();
  }

  @Get('by-student/:studentId')
  @ApiOperation({
    summary: 'Get all parents linked to a specific student',
    description: 'Fetches all parents/guardians associated with a given student ID (e.g. STU-2024-001).',
  })
  @ApiParam({ name: 'studentId', description: 'The student ID (e.g. STU-2024-001)', example: 'STU-2024-001' })
  @ApiResponse({ status: 200, description: 'Parents for the student returned successfully.' })
  @ApiResponse({ status: 404, description: 'Student not found.' })
  findByStudent(@Param('studentId') studentId: string) {
    return this.parentService.findByStudent(studentId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a single parent by UUID',
    description: 'Fetches a parent record using their system UUID.',
  })
  @ApiParam({ name: 'id', description: 'System UUID of the parent', example: 'a3f1c2d4-1234-5678-abcd-ef0123456789' })
  @ApiResponse({ status: 200, description: 'Parent found and returned.' })
  @ApiResponse({ status: 404, description: 'Parent not found.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.parentService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a parent record',
    description:
      'Partially updates a parent. All fields are optional. ' +
      'If studentId is updated, the new student must exist in the database.',
  })
  @ApiParam({ name: 'id', description: 'UUID of the parent to update', example: 'a3f1c2d4-1234-5678-abcd-ef0123456789' })
  @ApiBody({ type: UpdateParentDto })
  @ApiResponse({ status: 200, description: 'Parent updated successfully.' })
  @ApiResponse({ status: 400, description: 'Validation error.' })
  @ApiResponse({ status: 404, description: 'Parent or student not found.' })
  @ApiResponse({ status: 409, description: 'Email already registered.' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateParentDto,
  ) {
    return this.parentService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a parent',
    description: 'Permanently removes a parent record from the system.',
  })
  @ApiParam({ name: 'id', description: 'UUID of the parent to delete', example: 'a3f1c2d4-1234-5678-abcd-ef0123456789' })
  @ApiResponse({
    status: 200,
    description: 'Parent deleted successfully.',
    schema: { example: { message: 'Parent "Margaret Mukasa" deleted successfully.' } },
  })
  @ApiResponse({ status: 404, description: 'Parent not found.' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.parentService.remove(id);
  }
}