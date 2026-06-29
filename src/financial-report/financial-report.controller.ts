import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { FinancialReportService } from './financial-report.service';

@ApiTags('Financial Reports')
@Controller('financial-reports')
export class FinancialReportController {
  constructor(private readonly service: FinancialReportService) {}

  @Get('income')
  @ApiOperation({
    summary: 'Income report',
    description: 'Returns total fees expected, total collected, outstanding balance, and collection rate.',
  })
  @ApiResponse({ status: 200, description: 'Income report generated.' })
  getIncome() { return this.service.getIncomeReport(); }

  @Get('expenses')
  @ApiOperation({
    summary: 'Expenses report',
    description: 'Returns total expenses and a breakdown by category.',
  })
  @ApiResponse({ status: 200, description: 'Expenses report generated.' })
  getExpenses() { return this.service.getExpensesReport(); }

  @Get('balances')
  @ApiOperation({
    summary: 'Outstanding balances report',
    description: 'Returns total outstanding fees and a count of paid, partial, and unpaid students.',
  })
  @ApiResponse({ status: 200, description: 'Balances report generated.' })
  getBalances() { return this.service.getBalancesReport(); }

  @Get('monthly')
  @ApiOperation({
    summary: 'Monthly collection report',
    description: 'Returns income collected and expenses incurred per month with net income per month.',
  })
  @ApiResponse({ status: 200, description: 'Monthly report generated.' })
  getMonthly() { return this.service.getMonthlyReport(); }

  @Get('annual')
  @ApiOperation({
    summary: 'Annual financial summary',
    description: 'Returns the annual total of income, expenses, and net income with monthly breakdown.',
  })
  @ApiResponse({ status: 200, description: 'Annual report generated.' })
  getAnnual() { return this.service.getAnnualReport(); }

  @Get('student/:studentId')
  @ApiOperation({
    summary: 'Student payment history report',
    description: 'Returns all payments made by a student along with their current balance.',
  })
  @ApiParam({ name: 'studentId', example: 'STU-2024-001' })
  @ApiResponse({ status: 200, description: 'Student report generated.' })
  getStudentReport(@Param('studentId') studentId: string) {
    return this.service.getStudentReport(studentId);
  }
}