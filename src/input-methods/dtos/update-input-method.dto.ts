import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateInputMethodDto {
  @ApiProperty({
    description: 'Input method name',
    example: 'manual',
    required: false,
  })
  @IsString({ message: 'Name must be a string' })
  @IsOptional()
  name?: string;

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
    required: false,
  })
  @IsBoolean({ message: 'Is active must be a boolean' })
  @IsOptional()
  is_active?: boolean;
}
