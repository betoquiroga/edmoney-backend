import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export enum PaymentMethodType {
  CASH = 'cash',
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  BANK = 'bank',
  DIGITAL_WALLET = 'digital_wallet',
  OTHER = 'other',
}

export class PaymentMethod {
  @ApiProperty({
    description: 'Unique payment method identifier (UUID format)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description:
      'ID of the user who created this payment method (null for default methods)',
    example: '550e8400-e29b-41d4-a716-446655441111',
    required: false,
  })
  @IsUUID('4', { message: 'User ID must be a valid UUID' })
  @IsOptional()
  user_id?: string;

  @ApiProperty({
    description: 'Payment method name',
    example: 'Credit Card Visa',
  })
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @ApiProperty({
    description: 'Type of payment method',
    example: 'credit_card',
    enum: PaymentMethodType,
    required: false,
  })
  @IsString({ message: 'Type must be a string' })
  @IsOptional()
  type?: PaymentMethodType;

  @ApiProperty({
    description: 'Icon name or path for the payment method',
    example: 'credit-card',
    required: false,
  })
  @IsString({ message: 'Icon must be a string' })
  @IsOptional()
  icon?: string;

  @ApiProperty({
    description:
      'Whether this is a default payment method defined by the system',
    example: false,
  })
  @IsBoolean({ message: 'Is default must be a boolean' })
  is_default: boolean;

  @ApiProperty({
    description: 'Whether the payment method is active',
    example: true,
  })
  @IsBoolean({ message: 'Is active must be a boolean' })
  is_active: boolean;

  @ApiProperty({
    description: 'Timestamp when the payment method was created',
    example: '2023-06-01T12:00:00Z',
  })
  created_at: Date;

  @ApiProperty({
    description: 'Timestamp when the payment method was last updated',
    example: '2023-06-01T12:00:00Z',
  })
  updated_at: Date;
}
