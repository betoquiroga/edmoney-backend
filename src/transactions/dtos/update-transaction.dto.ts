import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateTransactionDto } from './create-transaction.dto';
import { IsUUID, IsNotEmpty } from 'class-validator';

export class UpdateTransactionDto extends PartialType(CreateTransactionDto) {
  @ApiProperty({
    description: 'Unique transaction identifier (UUID format)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID('4', { message: 'Transaction ID must be a valid UUID' })
  @IsNotEmpty({ message: 'Transaction ID is required' })
  id: string;
}
