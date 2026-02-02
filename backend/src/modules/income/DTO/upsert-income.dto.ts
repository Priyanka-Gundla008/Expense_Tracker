import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min, Max, IsNotEmpty, IsPositive } from 'class-validator';

export class UpsertIncomeDto {
  @ApiProperty({})
  @IsNotEmpty({ message: 'year is required' })
  @IsNumber({}, { message: 'income must be a number' })
  year: number;

  @ApiProperty({})
  @IsNotEmpty({ message: 'month is required' })
  @IsNumber({}, { message: 'income must be a number' })
  @Min(1)
  @Max(12)
  month: number;

  @ApiProperty({})
  @IsNotEmpty({ message: 'income is required' })
  @IsNumber({}, { message: 'income must be a number' })
  @IsPositive({ message: 'income must be greater than 0' })
  @Min(1)
  income: number;
}
