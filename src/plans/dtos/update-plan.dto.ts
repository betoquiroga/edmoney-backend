import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class UpdatePlanDto {
  @ApiProperty({ example: 'Pro Plus', description: 'Plan name' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    example: 'Access to all premium features',
    description: 'Plan description',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 29.99, description: 'Plan price' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  price?: number;

  @ApiProperty({
    example: { projectLimit: 20, storageLimit: '10GB' },
    description: 'Features included in this plan',
  })
  @IsObject()
  @IsOptional()
  features?: Record<string, any>;

  @ApiProperty({ example: 200, description: 'Maximum usage limit' })
  @IsNumber()
  @IsOptional()
  maxUsage?: number;

  @ApiProperty({ example: false, description: 'Whether the plan is active' })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
