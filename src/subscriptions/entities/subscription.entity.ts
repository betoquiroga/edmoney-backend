import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export enum SubscriptionStatus {
  ACTIVE = 'active',
  CANCELED = 'canceled',
  PAST_DUE = 'past_due',
  PENDING = 'pending',
  EXPIRED = 'expired',
}

export class Subscription {
  @ApiProperty({
    description: 'Unique subscription identifier',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'ID of the user who owns this subscription',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID('4', { message: 'User ID must be a valid UUID' })
  @IsNotEmpty({ message: 'User ID is required' })
  user_id: string;

  @ApiProperty({
    description: 'ID of the plan the user is subscribed to',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID('4', { message: 'Plan ID must be a valid UUID' })
  @IsNotEmpty({ message: 'Plan ID is required' })
  plan_id: string;

  @ApiProperty({
    description: 'Current status of the subscription',
    example: 'active',
    enum: SubscriptionStatus,
  })
  @IsEnum(SubscriptionStatus, {
    message:
      'Status must be one of: active, canceled, past_due, pending, expired',
  })
  @IsNotEmpty({ message: 'Status is required' })
  status: SubscriptionStatus;

  @ApiProperty({
    description: 'Date when the subscription started',
    example: '2023-01-01T00:00:00Z',
  })
  @IsDateString({}, { message: 'Start date must be a valid ISO date string' })
  @IsNotEmpty({ message: 'Start date is required' })
  start_date: Date;

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

  @ApiProperty({
    description: 'Timestamp when the subscription was created',
    example: '2023-06-01T12:00:00Z',
  })
  created_at: Date;

  @ApiProperty({
    description: 'Timestamp when the subscription was last updated',
    example: '2023-06-01T12:00:00Z',
  })
  updated_at: Date;
}
