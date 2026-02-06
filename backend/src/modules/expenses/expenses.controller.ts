import { Controller, Post, Body, UseGuards, Get, Param, Put, Delete, Query, ParseUUIDPipe, BadRequestException, Req } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './DTO/create-expense.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { UpdateExpenseDto } from './DTO/update-expense.dto';

@ApiTags('Expenses')
@ApiBearerAuth('JWT')
@Controller('api/expenses')
@UseGuards(JwtAuthGuard)
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) { }

  @Post('/create-expense')
  @ApiOperation({ summary: 'Create Expense' })
  async createExpense(
    @Body() createExpenseDto: CreateExpenseDto,
    @Req() req: any,
  ) {
    return this.expensesService.createExpense(
      createExpenseDto,
      req.user.id,
    );
  }


  @Get('')
  @ApiOperation({ summary: 'Get all expenses' })
  async getAll(@Req() req: any) {
    return this.expensesService.getAllExpenses(req.user.id);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search expenses by year and/or month' })
  @ApiQuery({ name: 'year', required: false, type: Number })
  @ApiQuery({ name: 'month', required: false, type: Number })
  @ApiQuery({ name: 'searchText', required: false, type: String })
  async searchExpenses(
    @Query('year') year?: number,
    @Query('month') month?: number,
    @Query('searchText') searchText?: string,
  ) {

    if (year && !/^\d{4}$/.test(year.toString())) {
      throw new BadRequestException('Year must be a 4-digit number');
    }

    if (month && (month < 1 || month > 12)) {
      throw new BadRequestException('Month must be between 1 and 12');
    }

    return this.expensesService.searchExpenses(
      year ? Number(year) : undefined,
      month ? Number(month) : undefined,
      searchText?.toString(),
    );
  }

  @Get('total-expense/current-month')
  @ApiOperation({ summary: 'Get total expense for a current month' })
  getCurrentMonthTotal(@Req() req: any) {
    return this.expensesService.getCurrentMonthTotalExpense(req.user.id);
  }

  @Get("category-summary")
  @ApiOperation({ summary: 'Fetch category-wise expense summary for a given year and optional month' })
  @ApiQuery({ name: 'year', required: true })
  @ApiQuery({ name: 'month', required: false })
  async getCategorySummary(
    @Req() req: any,
    @Query("year") year: number,
    @Query("month") month?: number,
  ) {
    if (year && !/^\d{4}$/.test(year.toString())) {
      throw new BadRequestException('Year must be a 4-digit number');
    }

    if (month && (month < 1 || month > 12)) {
      throw new BadRequestException('Month must be between 1 and 12');
    }

    return await this.expensesService.getCategorySummary(req.user.id, +year, month);

  }

  @Get('monthly-trend')
  @ApiOperation({ summary: 'Fetch monthly expense trend for a given year' })
  @ApiQuery({ name: 'year', required: true })
  async getMonthlyExpenseTrend(
    @Req() req: any,
    @Query('year') year?: number,
  ) {
    if (year && !/^\d{4}$/.test(year.toString())) {
      throw new BadRequestException('Year must be a 4-digit number');
    }

    const selectedYear = year || new Date().getFullYear();
    return this.expensesService.getMonthlyExpenseTrend(req.user.id, selectedYear);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get expense by ID' })
  async getExpenseById(
    @Param('id', new ParseUUIDPipe({
      version: '4',
      exceptionFactory: () => new BadRequestException('Invalid UUID'),
    })) id: string,
    @Req() req: any,
  ) {
    return this.expensesService.getExpenseById(id, req.user.id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update expense by ID' })
  async updateExpense(
    @Param('id', new ParseUUIDPipe({
      version: '4',
      exceptionFactory: () => new BadRequestException('Invalid UUID'),
    })) id: string,
    @Body() updateExpenseDto: UpdateExpenseDto,
    @Req() req: any,
  ) {
    return this.expensesService.updateExpense(
      id,
      updateExpenseDto,
      req.user.id,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete expense by ID' })
  async deleteExpense(
    @Param('id', new ParseUUIDPipe({
      version: '4',
      exceptionFactory: () => new BadRequestException('Invalid UUID'),
    })) id: string,
    @Req() req: any,
  ) {
    return this.expensesService.deleteExpense(id, req.user.id);
  }







}
