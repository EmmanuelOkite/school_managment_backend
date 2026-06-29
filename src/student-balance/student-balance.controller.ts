import { Controller, Get, Patch, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { StudentBalanceService } from './student-balance.service';
import { UpdateStudentBalanceDto } from './dto/update-student-balance.dto';

@ApiTags('Student Balances')
@Controller('student-balances')
export class StudentBalanceController {
  constructor(private readonly service: StudentBalanceService) {}

  @Get()
  @ApiOperation({ summary: 'Get all student balances', description: 'Returns balance status for every student who has made or owes a payment.' })
  @ApiResponse({ status: 200, description: 'All student balances returned.' })
  findAll() { return this.service.findAll(); }

  @Get(':studentId')
  @ApiOperation({ summary: 'Get balance for a specific student', description: 'Returns totalFees, totalPaid, balance, and payment status for a student.' })
  @ApiParam({ name: 'studentId', example: 'STU-2024-001' })
  @ApiResponse({ status: 200, description: 'Balance found.' })
  @ApiResponse({ status: 404, description: 'Student or balance not found.' })
  findByStudent(@Param('studentId') studentId: string) { return this.service.findByStudent(studentId); }

  @Patch(':studentId')
  @ApiOperation({ summary: 'Update total fees for a student', description: 'Allows manually setting the totalFees for a student. Balance is recalculated automatically.' })
  @ApiParam({ name: 'studentId', example: 'STU-2024-001' })
  @ApiBody({ type: UpdateStudentBalanceDto })
  @ApiResponse({ status: 200, description: 'Balance updated.' })
  @ApiResponse({ status: 404, description: 'Student or balance not found.' })
  update(@Param('studentId') studentId: string, @Body() dto: UpdateStudentBalanceDto) {
    return this.service.update(studentId, dto);
  }
}