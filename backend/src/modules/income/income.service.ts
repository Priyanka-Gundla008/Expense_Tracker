import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Income } from 'src/entities/income.entity';
import { UpsertIncomeDto } from './DTO/upsert-income.dto';
import { Expense } from 'src/entities/expense.entity';

@Injectable()
export class IncomeService {
  constructor(
    @InjectRepository(Income)
    private readonly incomeRepository: Repository<Income>,

    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,
  ) { }

  async upsertIncome(dto: UpsertIncomeDto, userId: string) {
    const { year, month, income } = dto;
    const existing = await this.incomeRepository.findOne({
      where: { year, month, userId }, // ✅ important
    });

    const MONTHS = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    const monthName = MONTHS[month - 1];

    if (existing) {
      existing.income = income;
      await this.incomeRepository.save(existing);

      return {
        message: `Income updated for ${monthName} ${year}`,
        data: existing,
      };
    }

    const newIncome = this.incomeRepository.create({
      ...dto,
      userId, // ✅ attach user
    });
    await this.incomeRepository.save(newIncome);

    return {
      message: `Income added for ${monthName} ${year}`,
      data: newIncome,
    };
  }

  async getIncome(userId: string, filter?: { year?: number; month?: number }) {
    if (!userId) {
      throw new BadRequestException('User not authenticated');
    }

    const query = this.incomeRepository
      .createQueryBuilder('income')
      .where('income.userId = :userId', { userId });

    if (filter?.year)
      query.andWhere('income.year = :year', { year: filter.year });

    if (filter?.month)
      query.andWhere('income.month = :month', { month: filter.month });

    const incomeData = await query.getMany();

    const results = await Promise.all(
      incomeData.map(async (inc) => {
        const totalExpenses = await this.expenseRepository
          .createQueryBuilder('expense')
          .select('SUM(expense.amount)', 'sum')
          .where('expense.userId = :userId', { userId })
          .andWhere('EXTRACT(YEAR FROM expense.date) = :year', { year: inc.year })
          .andWhere('EXTRACT(MONTH FROM expense.date) = :month', { month: inc.month })
          .getRawOne();

        const expenses = Number(totalExpenses.sum) || 0;
        const balance = Number(inc.income) - expenses;

        return {
          ...inc,
          expenses,
          balance,
        };
      }),
    );

    return results;
  }

}
