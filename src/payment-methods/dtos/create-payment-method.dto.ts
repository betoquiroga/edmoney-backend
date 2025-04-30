import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { PaymentMethodType } from '../entities/payment-method.entity';

export class CreatePaymentMethodDto {
  @ApiProperty({
    description:
      'ID of the user who is creating this payment method (null for default methods)',
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
  @IsEnum(PaymentMethodType, {
    message:
      'Type must be one of: cash, credit_card, debit_card, bank, digital_wallet, other',
  })
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
    default: false,
  })
  @IsBoolean({ message: 'Is default must be a boolean' })
  @IsOptional()
  is_default?: boolean;

  @ApiProperty({
    description: 'Whether the payment method is active',
    example: true,
    default: true,
  })
  @IsBoolean({ message: 'Is active must be a boolean' })
  @IsOptional()
  is_active?: boolean;
}
