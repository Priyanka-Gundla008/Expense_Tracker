import { Module } from '@nestjs/common';
import { IncomeService } from './income.service';
import { IncomeController } from './income.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Income } from 'src/entities/income.entity';
import { Expense } from 'src/entities/expense.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Income, Expense])],
  providers: [IncomeService],
  controllers: [IncomeController]
})
export class IncomeModule { }
