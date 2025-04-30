import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class Plan {
  @ApiProperty({
    description: 'Unique plan identifier (UUID format)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'Plan name',
    example: 'Pro',
  })
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @ApiProperty({
    description: 'Plan description',
    example: 'Access to premium features',
  })
  @IsString({ message: 'Description must be a string' })
  @IsNotEmpty({ message: 'Description is required' })
  description: string;

  @ApiProperty({
    description: 'Plan price',
    example: 19.99,
  })
  @IsNumber({}, { message: 'Price must be a number' })
  price: number;

  @ApiProperty({
    description: 'Features included in this plan',
    example: { projectLimit: 10, storageLimit: '5GB' },
  })
  features: Record<string, any>;

  @ApiProperty({
    description: 'Maximum usage limit',
    example: 100,
  })
  @IsNumber({}, { message: 'Max usage must be a number' })
  @IsOptional()
  maxUsage: number;

  @ApiProperty({
    description: 'Whether the plan is active',
    example: true,
  })
  @IsBoolean({ message: 'Is active must be a boolean' })
  isActive: boolean;

  @ApiProperty({
    description: 'Timestamp when the plan was created',
    example: '2023-06-01T12:00:00Z',
  })
  created_at: Date;

  @ApiProperty({
    description: 'Timestamp when the plan was last updated',
    example: '2023-06-01T12:00:00Z',
  })
  updated_at: Date;
}
