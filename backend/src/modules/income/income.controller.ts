import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  UseGuards,
  BadRequestException
} from '@nestjs/common';
import { IncomeService } from './income.service';
import { UpsertIncomeDto } from './DTO/upsert-income.dto';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

// import { GetIncomeDto } from './DTO/get-income.dto';

@ApiTags('Income')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard)
@Controller('api/income')
export class IncomeController {
  constructor(private readonly incomeService: IncomeService) { }

  @Post('/save-income')
  @ApiOperation({ summary: 'Save monthly income' })
  upsertIncome(@Body() dto: UpsertIncomeDto) {
    if (dto.year && !/^\d{4}$/.test(dto.year.toString())) {
      throw new BadRequestException('Year must be a 4-digit number');
    }
    return this.incomeService.upsertIncome(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get Current year and Current month income' })
  @ApiQuery({ name: 'year', required: true, type: Number })
  @ApiQuery({ name: 'month', required: true, type: Number })
  async getIncome(
    @Query('year') year : number,
    @Query('month') month : number,
  ) {

    if (year && !/^\d{4}$/.test(year.toString())) {
      throw new BadRequestException('Year must be a 4-digit number');
    }

    if (month && (month < 1 || month > 12)) {
      throw new BadRequestException('Month must be between 1 and 12');
    }

    const filter: any = {};
    if (year) filter.year = Number(year);
    if (month) filter.month = Number(month);

    const income = await this.incomeService.getIncome(filter);

    return {
      message: 'Income fetched successfully',
      data: income,
    };
  }
}
