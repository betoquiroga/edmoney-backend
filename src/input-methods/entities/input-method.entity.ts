import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class InputMethod {
  @ApiProperty({
    description: 'Unique input method identifier (UUID format)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'Input method name',
    example: 'manual',
  })
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @ApiProperty({
    description: 'Description of the input method',
    example: 'Manual transaction entry through the user interface',
    required: false,
  })
  @IsString({ message: 'Description must be a string' })
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Whether the input method is active',
    example: true,
  })
  @IsBoolean({ message: 'Is active must be a boolean' })
  is_active: boolean;
}
