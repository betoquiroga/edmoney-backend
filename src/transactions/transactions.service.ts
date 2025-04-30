import { Injectable, NotFoundException } from '@nestjs/common';
import { Transaction } from './entities/transaction.entity';
import { CreateTransactionDto } from './dtos/create-transaction.dto';
import { UpdateTransactionDto } from './dtos/update-transaction.dto';
import { SupabaseService } from '../database/supabase.service';

@Injectable()
export class TransactionsService {
  private readonly TABLE_NAME = 'transactions';

  constructor(private readonly supabaseService: SupabaseService) {}

  async create(
    createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    const now = new Date();

    // If is_recurring is not provided, default to false
    const isRecurring =
      createTransactionDto.is_recurring !== undefined
        ? createTransactionDto.is_recurring
        : false;

    const transactionData = {
      user_id: createTransactionDto.user_id,
      category_id: createTransactionDto.category_id || null,
      payment_method_id: createTransactionDto.payment_method_id || null,
      input_method_id: createTransactionDto.input_method_id,
      type: createTransactionDto.type,
      amount: createTransactionDto.amount,
      currency: createTransactionDto.currency,
      transaction_date: createTransactionDto.transaction_date,
      description: createTransactionDto.description || null,
      is_recurring: isRecurring,
      recurring_id: createTransactionDto.recurring_id || null,
      created_at: now,
      updated_at: now,
    };

    const { data, error } = await this.supabaseService
      .getClient()
      .from(this.TABLE_NAME)
      .insert(transactionData)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create transaction: ${error.message}`);
    }

    return data as Transaction;
  }

  async findAll(userId: string): Promise<Transaction[]> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from(this.TABLE_NAME)
      .select('*')
      .eq('user_id', userId)
      .order('transaction_date', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch transactions: ${error.message}`);
    }

    return data as Transaction[];
  }

  async findOne(id: string, userId: string): Promise<Transaction> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from(this.TABLE_NAME)
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }

    return data as Transaction;
  }

  async update(
    id: string,
    updateTransactionDto: UpdateTransactionDto,
  ): Promise<Transaction> {
    // First check if the transaction exists and belongs to the user
    await this.findOne(id, updateTransactionDto.user_id);

    const updateData = {
      ...updateTransactionDto,
      updated_at: new Date(),
    };

    // Remove id from the update data since we don't want to update the primary key
    delete updateData.id;

    const { data, error } = await this.supabaseService
      .getClient()
      .from(this.TABLE_NAME)
      .update(updateData)
      .eq('id', id)
      .eq('user_id', updateTransactionDto.user_id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update transaction: ${error.message}`);
    }

    return data as Transaction;
  }

  async remove(id: string, userId: string): Promise<void> {
    // First check if the transaction exists and belongs to the user
    await this.findOne(id, userId);

    const { error } = await this.supabaseService
      .getClient()
      .from(this.TABLE_NAME)
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      throw new Error(`Failed to delete transaction: ${error.message}`);
    }
  }
}
