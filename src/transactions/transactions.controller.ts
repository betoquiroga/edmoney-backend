import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dtos/create-transaction.dto';
import { UpdateTransactionDto } from './dtos/update-transaction.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Transaction } from './entities/transaction.entity';
import { QueryTransactionsDto } from './dtos/query-transactions.dto';
import { PaginatedTransactions } from './entities/paginated-transactions.entity';
import { TotalsByPeriodDto } from './dtos/totals-by-period.dto';
import { RequiredParamPipe } from '../helpers/pipes/required-param.pipe';

@ApiTags('transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new transaction' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Transaction created successfully',
    type: Transaction,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  create(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionsService.create(createTransactionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all transactions for a user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Transactions retrieved successfully',
    type: [Transaction],
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Missing required userId parameter',
  })
  findAll(@Query('userId', new RequiredParamPipe()) userId: string) {
    return this.transactionsService.findAll(userId);
  }

  @Get('query')
  @ApiOperation({ summary: 'Query transactions with filters' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Transactions retrieved successfully',
    type: PaginatedTransactions,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  queryTransactions(@Query() queryParams: QueryTransactionsDto) {
    return this.transactionsService.queryTransactions(queryParams);
  }

  @Get('totals-by-period')
  @ApiOperation({ summary: 'Get transaction totals by period' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Totals calculated successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          total: { type: 'number' },
          currency: { type: 'string' },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  getTotalsByPeriod(@Query() params: TotalsByPeriodDto) {
    return this.transactionsService.getTotalsByPeriod(params);
  }

  /**
   * GET /transactions/summary?userId=xxx
   * Devuelve el resumen financiero del usuario
   */
  @Get('summary')
  @ApiOperation({ summary: 'Get financial summary for a user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Summary retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        balance: { type: 'number' },
        totalIncome: { type: 'number' },
        totalExpense: { type: 'number' },
        currency: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Missing required userId parameter',
  })
  getSummary(@Query('userId', new RequiredParamPipe()) userId: string) {
    return this.transactionsService.getSummary(userId);
  }

  /**
   * GET /transactions/recent?userId=xxx
   * Devuelve las últimas 10 transacciones del usuario
   */
  @Get('recent')
  @ApiOperation({ summary: 'Get recent transactions for a user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Recent transactions retrieved successfully',
    type: [Transaction],
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Missing required userId parameter',
  })
  getRecent(@Query('userId', new RequiredParamPipe()) userId: string) {
    return this.transactionsService.getRecentTransactions(userId);
  }

  @Get('recurring/:recurringId')
  @ApiOperation({
    summary: 'Get all transactions with a specific recurring ID',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Recurring transactions retrieved successfully',
    type: [Transaction],
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Missing required userId parameter',
  })
  findByRecurringId(
    @Param('recurringId') recurringId: string,
    @Query('userId', new RequiredParamPipe()) userId: string,
  ) {
    return this.transactionsService.findByRecurringId(recurringId, userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a transaction by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Transaction retrieved successfully',
    type: Transaction,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Transaction not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Missing required userId parameter',
  })
  findOne(
    @Param('id') id: string,
    @Query('userId', new RequiredParamPipe()) userId: string,
  ) {
    return this.transactionsService.findOne(id, userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a transaction' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Transaction updated successfully',
    type: Transaction,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Transaction not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  update(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    if (id !== updateTransactionDto.id) {
      updateTransactionDto.id = id;
    }
    return this.transactionsService.update(id, updateTransactionDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a transaction' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Transaction deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Transaction not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Missing required userId parameter',
  })
  remove(
    @Param('id') id: string,
    @Query('userId', new RequiredParamPipe()) userId: string,
  ) {
    return this.transactionsService.remove(id, userId);
  }
}
