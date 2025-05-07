import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsDecimal,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';

export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
  TRANSFER = 'transfer',
}

export class Transaction {
  @ApiProperty({
    description: 'Unique transaction identifier (UUID format)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'ID of the user who owns this transaction',
    example: '550e8400-e29b-41d4-a716-446655441111',
  })
  @IsUUID('4', { message: 'User ID must be a valid UUID' })
  @IsNotEmpty({ message: 'User ID is required' })
  user_id: string;

  @ApiProperty({
    description: 'ID of the category for this transaction',
    example: '550e8400-e29b-41d4-a716-446655442222',
    required: false,
  })
  @IsUUID('4', { message: 'Category ID must be a valid UUID' })
  @IsOptional()
  category_id?: string;

  @ApiProperty({
    description: 'ID of the payment method used for this transaction',
    example: '550e8400-e29b-41d4-a716-446655443333',
    required: false,
  })
  @IsUUID('4', { message: 'Payment method ID must be a valid UUID' })
  @IsOptional()
  payment_method_id?: string;

  @ApiProperty({
    description: 'ID of the input method used to record this transaction',
    example: '550e8400-e29b-41d4-a716-446655444444',
  })
  @IsUUID('4', { message: 'Input method ID must be a valid UUID' })
  @IsNotEmpty({ message: 'Input method ID is required' })
  input_method_id: string;

  @ApiProperty({
    description: 'Type of transaction',
    example: 'expense',
    enum: TransactionType,
  })
  @IsEnum(TransactionType, {
    message: 'Type must be one of: income, expense, transfer',
  })
  @IsNotEmpty({ message: 'Type is required' })
  type: TransactionType;

  @ApiProperty({
    description: 'Transaction amount',
    example: 99.99,
  })
  @IsDecimal(
    { decimal_digits: '0,4' },
    { message: 'Amount must be a decimal number with up to 4 decimal places' },
  )
  @IsNotEmpty({ message: 'Amount is required' })
  amount: number;

  @ApiProperty({
    description: 'Currency code (ISO 4217)',
    example: 'USD',
  })
  @IsString({ message: 'Currency must be a string' })
  @Length(3, 3, { message: 'Currency must be a 3-character ISO code' })
  @IsNotEmpty({ message: 'Currency is required' })
  currency: string;

  @ApiProperty({
    description: 'Date and time when the transaction occurred',
    example: '2023-06-01T12:00:00Z',
  })
  @IsDate({ message: 'Transaction date must be a valid date' })
  @IsNotEmpty({ message: 'Transaction date is required' })
  transaction_date: Date;

  @ApiProperty({
    description: 'Optional description or note for the transaction',
    example: 'Grocery shopping at Walmart',
    required: false,
  })
  @IsString({ message: 'Description must be a string' })
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Whether this transaction is part of a recurring series',
    example: false,
  })
  @IsBoolean({ message: 'Is recurring must be a boolean' })
  is_recurring: boolean;

  @ApiProperty({
    description: 'ID that groups recurring transactions',
    example: '550e8400-e29b-41d4-a716-446655445555',
    required: false,
  })
  @IsUUID('4', { message: 'Recurring ID must be a valid UUID' })
  @IsOptional()
  recurring_id?: string;

  @ApiProperty({
    description: 'Timestamp when the transaction record was created',
    example: '2023-06-01T12:00:00Z',
  })
  created_at: Date;

  @ApiProperty({
    description: 'Timestamp when the transaction record was last updated',
    example: '2023-06-01T12:00:00Z',
  })
  updated_at: Date;

  @ApiProperty({
    description: 'Category name (populated from category_id)',
    example: 'Groceries',
    required: false,
  })
  category_name?: string;
}
