import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { SubscriptionStatus } from '../entities/subscription.entity';

export class UpdateSubscriptionDto {
  @ApiProperty({
    description: 'ID of the plan the user is subscribing to',
    example: '550e8400-e29b-41d4-a716-446655440000',
    required: false,
  })
  @IsUUID('4', { message: 'Plan ID must be a valid UUID' })
  @IsOptional()
  plan_id?: string;

  @ApiProperty({
    description: 'Current status of the subscription',
    example: 'active',
    enum: SubscriptionStatus,
    required: false,
  })
  @IsEnum(SubscriptionStatus, {
    message:
      'Status must be one of: active, canceled, past_due, pending, expired',
  })
  @IsOptional()
  status?: SubscriptionStatus;

  @ApiProperty({
    description: 'Date when the subscription ends (if applicable)',
    example: '2024-01-01T00:00:00Z',
    required: false,
  })
  @IsDateString({}, { message: 'End date must be a valid ISO date string' })
  @IsOptional()
  end_date?: Date;

  @ApiProperty({
    description: 'Start date of the current billing period',
    example: '2023-06-01T00:00:00Z',
    required: false,
  })
  @IsDateString(
    {},
    { message: 'Current period start must be a valid ISO date string' },
  )
  @IsOptional()
  current_period_start?: Date;

  @ApiProperty({
    description: 'End date of the current billing period',
    example: '2023-07-01T00:00:00Z',
    required: false,
  })
  @IsDateString(
    {},
    { message: 'Current period end must be a valid ISO date string' },
  )
  @IsOptional()
  current_period_end?: Date;

  @ApiProperty({
    description: 'PayPal subscription ID (if using PayPal)',
    example: 'I-BW452GLLEP1G',
    required: false,
  })
  @IsString({ message: 'PayPal subscription ID must be a string' })
  @IsOptional()
  paypal_subscription_id?: string;
}
