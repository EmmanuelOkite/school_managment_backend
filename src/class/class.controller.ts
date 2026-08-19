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
import { ClassService } from './class.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { Class } from './entities/class.entity';

@ApiTags('Classes')
@Controller('classes')
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new class',
    description:
      'Creates a new class. classTeacherId and assistantClassTeacherId must reference ' +
      'the teacherId (employee number) of an existing teacher. A class is unique by ' +
      'the combination of classCode and academicYear. currentStudentCount always starts at 0 ' +
      'and is managed by the system as students are enrolled.',
  })
  @ApiBody({ type: CreateClassDto })
  @ApiResponse({ status: 201, description: 'Class created successfully.', type: Class })
  @ApiResponse({ status: 400, description: 'Validation error, or assistant teacher same as class teacher.' })
  @ApiResponse({ status: 404, description: 'Class teacher or assistant class teacher not found.' })
  @ApiResponse({ status: 409, description: 'A class with the same classCode already exists for that academicYear.' })
  create(@Body() dto: CreateClassDto): Promise<Class> {
    return this.classService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all classes',
    description: 'Returns a list of all classes, newest first.',
  })
  @ApiResponse({ status: 200, description: 'List of classes returned successfully.', type: [Class] })
  findAll(): Promise<Class[]> {
    return this.classService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a single class by UUID',
    description: 'Fetches the full details of a class using its system UUID.',
  })
  @ApiParam({ name: 'id', description: 'System UUID of the class', example: 'a3f1c2d4-1234-5678-abcd-ef0123456789' })
  @ApiResponse({ status: 200, description: 'Class found and returned.', type: Class })
  @ApiResponse({ status: 404, description: 'Class not found.' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Class> {
    return this.classService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a class',
    description: 'Partially updates an existing class. All fields are optional.',
  })
  @ApiParam({ name: 'id', description: 'UUID of the class to update', example: 'a3f1c2d4-1234-5678-abcd-ef0123456789' })
  @ApiBody({ type: UpdateClassDto })
  @ApiResponse({ status: 200, description: 'Class updated successfully.', type: Class })
  @ApiResponse({ status: 400, description: 'Validation error, or assistant teacher same as class teacher.' })
  @ApiResponse({ status: 404, description: 'Class, class teacher, or assistant class teacher not found.' })
  @ApiResponse({ status: 409, description: 'A class with the same classCode already exists for that academicYear.' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateClassDto,
  ): Promise<Class> {
    return this.classService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a class',
    description: 'Permanently removes a class record from the system.',
  })
  @ApiParam({ name: 'id', description: 'UUID of the class to delete', example: 'a3f1c2d4-1234-5678-abcd-ef0123456789' })
  @ApiResponse({
    status: 200,
    description: 'Class deleted successfully.',
    schema: { example: { message: 'Class "Senior 1" deleted successfully.' } },
  })
  @ApiResponse({ status: 404, description: 'Class not found.' })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<{ message: string }> {
    return this.classService.remove(id);
  }
}
