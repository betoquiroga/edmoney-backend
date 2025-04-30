import { ApiProperty } from '@nestjs/swagger';
import { Transaction } from './transaction.entity';

export class PaginatedTransactions {
  @ApiProperty({
    description: 'Array of transaction objects',
    type: [Transaction],
  })
  data: Transaction[];

  @ApiProperty({
    description: 'Total count of matching transactions',
    example: 120,
  })
  count: number;
}
