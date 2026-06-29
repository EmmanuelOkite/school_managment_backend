import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { FeeStructureService } from './fee-structure.service';
import { CreateFeeStructureDto } from './dto/create-fee-structure.dto';
import { UpdateFeeStructureDto } from './dto/update-fee-structure.dto';

@ApiTags('Fee Structures')
@Controller('fee-structures')
export class FeeStructureController {
  constructor(private readonly service: FeeStructureService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a fee structure', description: 'Defines the fees expected from a class for a given term.' })
  @ApiBody({ type: CreateFeeStructureDto })
  @ApiResponse({ status: 201, description: 'Fee structure created.' })
  @ApiResponse({ status: 400, description: 'Validation error.' })
  create(@Body() dto: CreateFeeStructureDto) { return this.service.create(dto); }

  @Get()
  @ApiOperation({ summary: 'Get all fee structures' })
  @ApiResponse({ status: 200, description: 'All fee structures returned.' })
  findAll() { return this.service.findAll(); }

  @Get('class/:classId')
  @ApiOperation({ summary: 'Get fee structures by class' })
  @ApiParam({ name: 'classId', example: 'Senior Four' })
  @ApiResponse({ status: 200, description: 'Fee structures for the class returned.' })
  findByClass(@Param('classId') classId: string) { return this.service.findByClass(classId); }

  @Get('term/:term')
  @ApiOperation({ summary: 'Get fee structures by term' })
  @ApiParam({ name: 'term', example: 'Term 1' })
  @ApiResponse({ status: 200, description: 'Fee structures for the term returned.' })
  findByTerm(@Param('term') term: string) { return this.service.findByTerm(term); }

  @Get(':id')
  @ApiOperation({ summary: 'Get a fee structure by ID' })
  @ApiParam({ name: 'id', description: 'UUID of the fee structure' })
  @ApiResponse({ status: 200, description: 'Fee structure found.' })
  @ApiResponse({ status: 404, description: 'Not found.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) { return this.service.findOne(id); }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a fee structure' })
  @ApiParam({ name: 'id', description: 'UUID of the fee structure' })
  @ApiBody({ type: UpdateFeeStructureDto })
  @ApiResponse({ status: 200, description: 'Fee structure updated.' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateFeeStructureDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a fee structure' })
  @ApiParam({ name: 'id', description: 'UUID of the fee structure' })
  @ApiResponse({ status: 200, description: 'Deleted successfully.' })
  remove(@Param('id', ParseUUIDPipe) id: string) { return this.service.remove(id); }
}