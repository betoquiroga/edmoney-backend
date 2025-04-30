import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDecimal,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';

export enum AccountType {
  BANK = 'bank',
  CASH = 'cash',
  CREDIT_CARD = 'credit_card',
  INVESTMENT = 'investment',
}

export class Account {
  @ApiProperty({
    description: 'Unique account identifier (UUID format)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'ID of the user who owns this account',
    example: '550e8400-e29b-41d4-a716-446655441111',
  })
  @IsUUID('4', { message: 'User ID must be a valid UUID' })
  @IsNotEmpty({ message: 'User ID is required' })
  user_id: string;

  @ApiProperty({
    description: 'Account name',
    example: 'BCP Checking Account',
  })
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @ApiProperty({
    description: 'Type of account',
    example: 'bank',
    enum: AccountType,
  })
  @IsEnum(AccountType, {
    message: 'Type must be one of: bank, cash, credit_card, investment',
  })
  @IsNotEmpty({ message: 'Type is required' })
  type: AccountType;

  @ApiProperty({
    description: 'Initial balance when the account was created',
    example: 1000.0,
  })
  @IsDecimal(
    { decimal_digits: '0,4' },
    {
      message:
        'Initial balance must be a decimal number with up to 4 decimal places',
    },
  )
  @IsNotEmpty({ message: 'Initial balance is required' })
  initial_balance: number;

  @ApiProperty({
    description: 'Current balance of the account',
    example: 1250.5,
  })
  @IsDecimal(
    { decimal_digits: '0,4' },
    {
      message:
        'Current balance must be a decimal number with up to 4 decimal places',
    },
  )
  @IsNotEmpty({ message: 'Current balance is required' })
  current_balance: number;

  @ApiProperty({
    description: 'Currency code (ISO 4217)',
    example: 'USD',
  })
  @IsString({ message: 'Currency must be a string' })
  @Length(3, 3, { message: 'Currency must be a 3-character ISO code' })
  @IsNotEmpty({ message: 'Currency is required' })
  currency: string;

  @ApiProperty({
    description: 'Whether the account is active',
    example: true,
  })
  @IsBoolean({ message: 'Is active must be a boolean' })
  is_active: boolean;

  @ApiProperty({
    description: 'Timestamp when the account was created',
    example: '2023-06-01T12:00:00Z',
  })
  created_at: Date;

  @ApiProperty({
    description: 'Timestamp when the account was last updated',
    example: '2023-06-01T12:00:00Z',
  })
  updated_at: Date;
}
