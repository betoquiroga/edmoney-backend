import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsDateString } from 'class-validator';

export class TotalsByPeriodDto {
  @ApiProperty({
    description: 'User ID for filtering transactions',
    example: 'user-uuid',
  })
  @IsString()
  userId: string;

  @ApiPropertyOptional({
    description: 'Transaction type (income/expense)',
    example: 'expense',
  })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiProperty({
    description: 'Start date for period (ISO format)',
    example: '2023-01-01',
  })
  @IsDateString()
  startDate: string;

  @ApiProperty({
    description: 'End date for period (ISO format)',
    example: '2023-12-31',
  })
  @IsDateString()
  endDate: string;
}
