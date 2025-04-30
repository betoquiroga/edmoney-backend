import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class User {
  @ApiProperty({
    description: 'Unique user identifier (UUID format)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({
    description: 'User full name',
    example: 'John Doe',
  })
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @ApiProperty({
    description: 'User avatar URL',
    example: 'https://example.com/avatar.jpg',
    required: false,
  })
  @IsString({ message: 'Avatar URL must be a string' })
  @IsOptional()
  avatar?: string;

  @ApiProperty({
    description: 'Timestamp when the user was created',
    example: '2023-06-01T12:00:00Z',
  })
  created_at: Date;

  @ApiProperty({
    description: 'Timestamp when the user was last updated',
    example: '2023-06-01T12:00:00Z',
  })
  updated_at: Date;
}
