import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { TransactionType } from '../entities/category.entity';

export class UpdateCategoryDto {
  @ApiProperty({
    description:
      'ID of the user who owns this category (null for default categories)',
    example: '550e8400-e29b-41d4-a716-446655441111',
    required: false,
  })
  @IsUUID('4', { message: 'User ID must be a valid UUID' })
  @IsOptional()
  user_id?: string;

  @ApiProperty({
    description: 'Category name',
    example: 'Groceries',
    required: false,
  })
  @IsString({ message: 'Name must be a string' })
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Type of transaction this category applies to',
    example: 'expense',
    enum: TransactionType,
    required: false,
  })
  @IsEnum(TransactionType, {
    message: 'Type must be one of: income, expense, transfer',
  })
  @IsOptional()
  type?: TransactionType;

  @ApiProperty({
    description: 'Icon name or path for the category',
    example: 'shopping-cart',
    required: false,
  })
  @IsString({ message: 'Icon must be a string' })
  @IsOptional()
  icon?: string;

  @ApiProperty({
    description: 'Whether this is a default category defined by the system',
    example: false,
    required: false,
  })
  @IsBoolean({ message: 'Is default must be a boolean' })
  @IsOptional()
  is_default?: boolean;

  @ApiProperty({
    description: 'Whether the category is active',
    example: true,
    required: false,
  })
  @IsBoolean({ message: 'Is active must be a boolean' })
  @IsOptional()
  is_active?: boolean;
}
