import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, ParseUUIDPipe, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiQuery } from '@nestjs/swagger';
import { ExpenseService } from './expense.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { ExpenseCategory } from './enums/expense.enum';

@ApiTags('Expenses')
@Controller('expenses')
export class ExpenseController {
  constructor(private readonly service: ExpenseService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Record a new expense', description: 'Records a school expenditure.' })
  @ApiBody({ type: CreateExpenseDto })
  @ApiResponse({ status: 201, description: 'Expense recorded.' })
  @ApiResponse({ status: 400, description: 'Validation error.' })
  create(@Body() dto: CreateExpenseDto) { return this.service.create(dto); }

  @Get()
  @ApiOperation({ summary: 'Get all expenses' })
  @ApiResponse({ status: 200, description: 'All expenses returned.' })
  findAll() { return this.service.findAll(); }

  @Get('category/:category')
  @ApiOperation({ summary: 'Get expenses by category' })
  @ApiParam({ name: 'category', enum: ExpenseCategory, example: ExpenseCategory.SALARIES })
  @ApiResponse({ status: 200, description: 'Expenses for the category returned.' })
  findByCategory(@Param('category') category: ExpenseCategory) { return this.service.findByCategory(category); }

  @Get('month/:month')
  @ApiOperation({ summary: 'Get expenses by month', description: 'Filter expenses by month in YYYY-MM format.' })
  @ApiParam({ name: 'month', example: '2024-01' })
  @ApiResponse({ status: 200, description: 'Monthly expenses returned.' })
  findByMonth(@Param('month') month: string) { return this.service.findByMonth(month); }

  @Get(':id')
  @ApiOperation({ summary: 'Get an expense by UUID' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200, description: 'Expense found.' })
  @ApiResponse({ status: 404, description: 'Not found.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) { return this.service.findOne(id); }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an expense' })
  @ApiParam({ name: 'id' })
  @ApiBody({ type: UpdateExpenseDto })
  @ApiResponse({ status: 200, description: 'Expense updated.' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateExpenseDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an expense' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200, description: 'Deleted successfully.' })
  remove(@Param('id', ParseUUIDPipe) id: string) { return this.service.remove(id); }
}