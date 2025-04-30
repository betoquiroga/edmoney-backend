import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
  TRANSFER = 'transfer',
}

export class Category {
  @ApiProperty({
    description: 'Unique category identifier (UUID format)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description:
      'ID of the user who created this category (null for default categories)',
    example: '550e8400-e29b-41d4-a716-446655441111',
    required: false,
  })
  @IsUUID('4', { message: 'User ID must be a valid UUID' })
  @IsOptional()
  user_id?: string;

  @ApiProperty({
    description: 'Category name',
    example: 'Groceries',
  })
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @ApiProperty({
    description: 'Type of transaction this category applies to',
    example: 'expense',
    enum: TransactionType,
  })
  @IsEnum(TransactionType, {
    message: 'Type must be one of: income, expense, transfer',
  })
  @IsNotEmpty({ message: 'Type is required' })
  type: TransactionType;

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
  })
  @IsBoolean({ message: 'Is default must be a boolean' })
  is_default: boolean;

  @ApiProperty({
    description: 'Whether the category is active',
    example: true,
  })
  @IsBoolean({ message: 'Is active must be a boolean' })
  is_active: boolean;

  @ApiProperty({
    description: 'Timestamp when the category was created',
    example: '2023-06-01T12:00:00Z',
  })
  created_at: Date;

  @ApiProperty({
    description: 'Timestamp when the category was last updated',
    example: '2023-06-01T12:00:00Z',
  })
  updated_at: Date;
}
