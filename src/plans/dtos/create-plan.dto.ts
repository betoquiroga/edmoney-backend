import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreatePlanDto {
  @ApiProperty({ example: 'Pro', description: 'Plan name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Access to premium features',
    description: 'Plan description',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 19.99, description: 'Plan price' })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({
    example: { projectLimit: 10, storageLimit: '5GB' },
    description: 'Features included in this plan',
  })
  @IsObject()
  @IsOptional()
  features?: Record<string, any>;

  @ApiProperty({ example: 100, description: 'Maximum usage limit' })
  @IsNumber()
  @IsOptional()
  maxUsage?: number;

  @ApiProperty({ example: true, description: 'Whether the plan is active' })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
