import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { FeeCollectionService } from './fee-collection.service';
import { CreateFeeCollectionDto } from './dto/create-fee-collection.dto';
import { UpdateFeeCollectionDto } from './dto/update-fee-collection.dto';

@ApiTags('Fee Collections')
@Controller('fee-collections')
export class FeeCollectionController {
  constructor(private readonly service: FeeCollectionService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Record a fee payment', description: 'Records a payment and automatically updates the student balance.' })
  @ApiBody({ type: CreateFeeCollectionDto })
  @ApiResponse({ status: 201, description: 'Payment recorded.' })
  @ApiResponse({ status: 400, description: 'Validation error.' })
  @ApiResponse({ status: 404, description: 'Student or fee structure not found.' })
  @ApiResponse({ status: 409, description: 'Duplicate receipt number.' })
  create(@Body() dto: CreateFeeCollectionDto) { return this.service.create(dto); }

  @Get()
  @ApiOperation({ summary: 'Get all fee collection records' })
  @ApiResponse({ status: 200, description: 'All records returned.' })
  findAll() { return this.service.findAll(); }

  @Get('student/:studentId')
  @ApiOperation({ summary: 'Get all payments for a student' })
  @ApiParam({ name: 'studentId', example: 'STU-2024-001' })
  @ApiResponse({ status: 200, description: 'Student payment history returned.' })
  findByStudent(@Param('studentId') studentId: string) { return this.service.findByStudent(studentId); }

  @Get('receipt/:receiptNumber')
  @ApiOperation({ summary: 'Get a payment by receipt number' })
  @ApiParam({ name: 'receiptNumber', example: 'RCP-2024-00123' })
  @ApiResponse({ status: 200, description: 'Payment record found.' })
  @ApiResponse({ status: 404, description: 'Receipt not found.' })
  findByReceipt(@Param('receiptNumber') receiptNumber: string) { return this.service.findByReceipt(receiptNumber); }

  @Get(':id')
  @ApiOperation({ summary: 'Get a fee collection record by UUID' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200, description: 'Record found.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) { return this.service.findOne(id); }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a fee collection record' })
  @ApiParam({ name: 'id' })
  @ApiBody({ type: UpdateFeeCollectionDto })
  @ApiResponse({ status: 200, description: 'Record updated.' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateFeeCollectionDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a fee collection record' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200, description: 'Deleted successfully.' })
  remove(@Param('id', ParseUUIDPipe) id: string) { return this.service.remove(id); }
}