import { Injectable, NotFoundException } from '@nestjs/common';
import { Transaction } from './entities/transaction.entity';
import { CreateTransactionDto } from './dtos/create-transaction.dto';
import { UpdateTransactionDto } from './dtos/update-transaction.dto';
import { SupabaseService } from '../database/supabase.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TransactionsService {
  private readonly TABLE_NAME = 'transactions';

  constructor(private readonly supabaseService: SupabaseService) {}

  async create(
    createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    const now = new Date();
    const transactionId = uuidv4();

    // If is_recurring is not provided, default to false
    const isRecurring =
      createTransactionDto.is_recurring !== undefined
        ? createTransactionDto.is_recurring
        : false;

    // Generate UUID for recurring_id if is_recurring is true and no recurring_id is provided
    if (isRecurring && !createTransactionDto.recurring_id) {
      createTransactionDto.recurring_id = uuidv4();
    }

    const transactionData = {
      id: transactionId,
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

  async findAll(
    userId: string,
  ): Promise<{ transactions: Transaction[]; message?: string }> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from(this.TABLE_NAME)
      .select('*')
      .eq('user_id', userId)
      .order('transaction_date', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch transactions: ${error.message}`);
    }

    return {
      transactions: data as Transaction[],
      message: 'Transactions retrieved successfully',
    };
  }

  // New method to query transactions with various filters
  async queryTransactions(params: {
    userId: string;
    categoryId?: string;
    paymentMethodId?: string;
    type?: string;
    startDate?: string;
    endDate?: string;
    minAmount?: number;
    maxAmount?: number;
    isRecurring?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<{ data: Transaction[]; count: number }> {
    const {
      userId,
      categoryId,
      paymentMethodId,
      type,
      startDate,
      endDate,
      minAmount,
      maxAmount,
      isRecurring,
      limit = 100,
      offset = 0,
    } = params;

    // Start building the query
    let query = this.supabaseService
      .getClient()
      .from(this.TABLE_NAME)
      .select('*', { count: 'exact' })
      .eq('user_id', userId);

    // Apply filters if provided
    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }

    if (paymentMethodId) {
      query = query.eq('payment_method_id', paymentMethodId);
    }

    if (type) {
      query = query.eq('type', type);
    }

    if (startDate) {
      query = query.gte('transaction_date', startDate);
    }

    if (endDate) {
      query = query.lte('transaction_date', endDate);
    }

    if (minAmount !== undefined) {
      query = query.gte('amount', minAmount);
    }

    if (maxAmount !== undefined) {
      query = query.lte('amount', maxAmount);
    }

    if (isRecurring !== undefined) {
      query = query.eq('is_recurring', isRecurring);
    }

    // Apply pagination and ordering
    const { data, error, count } = await query
      .order('transaction_date', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw new Error(`Failed to fetch transactions: ${error.message}`);
    }

    return {
      data: data as Transaction[],
      count: count || 0,
    };
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

  async findByRecurringId(
    recurringId: string,
    userId: string,
  ): Promise<Transaction[]> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from(this.TABLE_NAME)
      .select('*')
      .eq('recurring_id', recurringId)
      .eq('user_id', userId)
      .order('transaction_date', { ascending: false });

    if (error) {
      throw new Error(
        `Failed to fetch recurring transactions: ${error.message}`,
      );
    }

    return data as Transaction[];
  }

  async getTotalsByPeriod(params: {
    userId: string;
    type?: string;
    startDate: string;
    endDate: string;
  }): Promise<{ total: number; currency: string }[]> {
    const { userId, type, startDate, endDate } = params;

    // Using SQL directly for aggregation operation that might not be well supported by the Supabase builder
    let query = `
      SELECT currency, SUM(amount) as total
      FROM ${this.TABLE_NAME}
      WHERE user_id = '${userId}'
        AND transaction_date >= '${startDate}'
        AND transaction_date <= '${endDate}'
    `;

    if (type) {
      query += ` AND type = '${type}'`;
    }

    query += ` GROUP BY currency`;

    const { data, error } = await this.supabaseService
      .getClient()
      .rpc('execute_sql', { sql_query: query });

    if (error) {
      throw new Error(`Failed to calculate totals: ${error.message}`);
    }

    return data as { total: number; currency: string }[];
  }

  /**
   * Devuelve el resumen financiero del usuario: saldo, ingresos y egresos totales
   */
  async getSummary(userId: string): Promise<{
    balance: number;
    totalIncome: number;
    totalExpense: number;
    currency: string;
  }> {
    // Obtener ingresos
    const { data: incomeData, error: incomeError } = await this.supabaseService
      .getClient()
      .from(this.TABLE_NAME)
      .select('amount, currency')
      .eq('user_id', userId)
      .eq('type', 'income');

    if (incomeError) {
      throw new Error(`Failed to fetch income: ${incomeError.message}`);
    }

    // Obtener egresos
    const { data: expenseData, error: expenseError } =
      await this.supabaseService
        .getClient()
        .from(this.TABLE_NAME)
        .select('amount, currency')
        .eq('user_id', userId)
        .eq('type', 'expense');

    if (expenseError) {
      throw new Error(`Failed to fetch expenses: ${expenseError.message}`);
    }

    // Suponemos una sola moneda (la primera encontrada)
    const currency =
      incomeData?.[0]?.currency || expenseData?.[0]?.currency || 'USD';
    const totalIncome =
      incomeData?.reduce((acc, t) => acc + Number(t.amount), 0) || 0;
    const totalExpense =
      expenseData?.reduce((acc, t) => acc + Number(t.amount), 0) || 0;
    const balance = totalIncome - totalExpense;

    return { balance, totalIncome, totalExpense, currency };
  }

  /**
   * Devuelve las últimas 10 transacciones de un usuario
   */
  async getRecentTransactions(userId: string): Promise<Transaction[]> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from(this.TABLE_NAME)
      .select('*')
      .eq('user_id', userId)
      .order('transaction_date', { ascending: false })
      .limit(10);

    if (error) {
      throw new Error(`Failed to fetch recent transactions: ${error.message}`);
    }

    return data as Transaction[];
  }
}
