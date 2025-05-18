import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { Transaction, TransactionType } from './entities/transaction.entity';
import { CreateTransactionDto } from './dtos/create-transaction.dto';
import { UpdateTransactionDto } from './dtos/update-transaction.dto';
import { SupabaseService } from '../database/supabase.service';
import { v4 as uuidv4 } from 'uuid';
import { CategoriesService } from '../categories/categories.service';
import { QueryTransactionsDto } from './dtos/query-transactions.dto';
import { TotalsByPeriodDto } from './dtos/totals-by-period.dto';
import { PaginatedTransactions } from './entities/paginated-transactions.entity';

/**
 * Resultado de métricas para el dashboard
 */
export interface DashboardMetrics {
  categorySummary: {
    category_id: string;
    category_name: string;
    total: number;
    percentage: number;
  }[];
  monthlyTrend: {
    month: string;
    income: number;
    expense: number;
  }[];
  avgTransaction: number;
  totalTransactions: number;
  mostActiveDay: string;
}

@Injectable()
export class TransactionsService {
  private readonly logger = new Logger(TransactionsService.name);
  private readonly TABLE_NAME = 'transactions';

  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly categoriesService: CategoriesService,
  ) {}

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
   * Procesa las transacciones para añadir nombres de categoría basados en IDs
   */
  private async addCategoryNames(
    transactions: Transaction[],
  ): Promise<Transaction[]> {
    console.log(
      'Categorías de transacciones:',
      transactions.map((t) => t.category_id),
    );

    // Crear un mapa para evitar buscar la misma categoría múltiples veces
    const categoryCache: Record<string, string> = {};

    // Procesar cada transacción en paralelo
    const enrichedTransactions = await Promise.all(
      transactions.map(async (transaction) => {
        // Si no hay ID de categoría, devolvemos "Sin categoría"
        if (!transaction.category_id) {
          return {
            ...transaction,
            category_name: 'Sin categoría',
          };
        }

        // Si ya tenemos el nombre en caché, lo reutilizamos
        if (categoryCache[transaction.category_id]) {
          return {
            ...transaction,
            category_name: categoryCache[transaction.category_id],
          };
        }

        try {
          // Intentamos obtener la categoría real usando el servicio
          const category = await this.categoriesService.findOne(
            transaction.category_id,
          );

          // Guardamos en caché
          categoryCache[transaction.category_id] = category.name;

          return {
            ...transaction,
            category_name: category.name,
          };
        } catch (error) {
          // Si la categoría no existe, manejamos el caso de manera elegante
          // Para IDs en formato cat-xxx, damos formato legible
          if (transaction.category_id.startsWith('cat-')) {
            const categorySlug = transaction.category_id.replace('cat-', '');
            const categoryName =
              categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1);
            categoryCache[transaction.category_id] = categoryName;
            return {
              ...transaction,
              category_name: categoryName,
            };
          }

          // Para cualquier otro formato, usamos un nombre más descriptivo
          const categoryName = 'Categoría desconocida';
          categoryCache[transaction.category_id] = categoryName;
          return {
            ...transaction,
            category_name: categoryName,
          };
        }
      }),
    );

    return enrichedTransactions;
  }

  /**
   * Devuelve las últimas 10 transacciones de un usuario
   */
  async getRecentTransactions(userId: string): Promise<Transaction[]> {
    // Usar un JOIN con la tabla de categorías para obtener directamente los nombres
    const { data, error } = await this.supabaseService
      .getClient()
      .from(this.TABLE_NAME)
      .select(
        `
        *,
        categories:category_id (
          name
        )
      `,
      )
      .eq('user_id', userId)
      .order('transaction_date', { ascending: false })
      .limit(10);

    if (error) {
      throw new Error(`Failed to fetch recent transactions: ${error.message}`);
    }

    // Reformatear la respuesta para aplanar la estructura anidada
    return data.map((transaction: any) => {
      return {
        ...transaction,
        // Si hay una categoría relacionada, usar su nombre; de lo contrario, usar un valor predeterminado
        category_name: transaction.categories
          ? transaction.categories.name
          : transaction.category_id
            ? transaction.category_id.startsWith('cat-')
              ? transaction.category_id
                  .replace('cat-', '')
                  .charAt(0)
                  .toUpperCase() +
                transaction.category_id.replace('cat-', '').slice(1)
              : 'Categoría desconocida'
            : 'Sin categoría',
        // Eliminar el objeto anidado de categorías para mantener la estructura plana
        categories: undefined,
      };
    });
  }

  /**
   * Get transaction metrics for dashboard
   * @param userId User ID
   * @param period Period to analyze (month, quarter, year)
   */
  async getMetrics(userId: string, period: string = 'month'): Promise<DashboardMetrics> {
    try {
      // Calculate date ranges based on the period
      const now = new Date();
      let startDate: Date;
      
      switch (period) {
        case 'year':
          startDate = new Date(now.getFullYear(), 0, 1); // Jan 1st of current year
          break;
        case 'quarter':
          const quarter = Math.floor(now.getMonth() / 3);
          startDate = new Date(now.getFullYear(), quarter * 3, 1); // Start of current quarter
          break;
        case 'week':
          const day = now.getDay();
          const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Sunday
          startDate = new Date(now.getFullYear(), now.getMonth(), diff); // Start of current week (Monday)
          break;
        case 'month':
        default:
          startDate = new Date(now.getFullYear(), now.getMonth(), 1); // Start of current month
          break;
      }
      
      // Format date for SQL query
      const formattedStartDate = startDate.toISOString();
      
      // Get all transactions for the period with category information
      const { data: transactions, error } = await this.supabaseService
        .getClient()
        .from(this.TABLE_NAME)
        .select('*, categories(name)')
        .eq('user_id', userId)
        .gte('transaction_date', formattedStartDate)
        .order('transaction_date');
      
      if (error) {
        this.logger.error(`Error fetching transaction metrics: ${error.message}`);
        throw new Error(`Failed to fetch transaction metrics: ${error.message}`);
      }
      
      if (!transactions || transactions.length === 0) {
        // Return empty metrics if no transactions
        return {
          categorySummary: [],
          monthlyTrend: [],
          avgTransaction: 0,
          totalTransactions: 0,
          mostActiveDay: '',
        };
      }
      
      // Calculate category summary
      const categoryTotals: Record<string, { total: number; name: string }> = {};
      let totalAmount = 0;
      
      transactions.forEach(tx => {
        if (tx.type === TransactionType.EXPENSE) {
          const catId = tx.category_id || 'uncategorized';
          if (!categoryTotals[catId]) {
            categoryTotals[catId] = { 
              total: 0, 
              name: tx.categories?.name || 'Sin categoría' 
            };
          }
          categoryTotals[catId].total += Math.abs(tx.amount);
          totalAmount += Math.abs(tx.amount);
        }
      });
      
      const categorySummary = Object.entries(categoryTotals).map(([category_id, data]) => ({
        category_id,
        category_name: data.name,
        total: Math.round(data.total * 100) / 100,
        percentage: totalAmount ? Math.round((data.total / totalAmount) * 1000) / 10 : 0,
      })).sort((a, b) => b.total - a.total);
      
      // Calculate monthly trend
      const monthlyData: Record<string, { income: number; expense: number }> = {};
      
      transactions.forEach(tx => {
        const date = new Date(tx.transaction_date);
        const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        
        if (!monthlyData[month]) {
          monthlyData[month] = { income: 0, expense: 0 };
        }
        
        if (tx.type === TransactionType.INCOME) {
          monthlyData[month].income += tx.amount;
        } else if (tx.type === TransactionType.EXPENSE) {
          monthlyData[month].expense += Math.abs(tx.amount);
        }
      });
      
      const monthlyTrend = Object.entries(monthlyData).map(([month, data]) => ({
        month,
        income: Math.round(data.income * 100) / 100,
        expense: Math.round(data.expense * 100) / 100,
      })).sort((a, b) => a.month.localeCompare(b.month));
      
      // Calculate average transaction amount
      const avgTransaction = totalAmount / transactions.filter(tx => tx.type === TransactionType.EXPENSE).length;
      
      // Find most active day of week
      const dayCount: Record<string, number> = {
        'domingo': 0, 'lunes': 0, 'martes': 0, 'miércoles': 0, 'jueves': 0, 'viernes': 0, 'sábado': 0
      };
      
      const days = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
      
      transactions.forEach(tx => {
        const date = new Date(tx.transaction_date);
        const day = days[date.getDay()];
        dayCount[day] += 1;
      });
      
      let mostActiveDay = days[0];
      let maxCount = 0;
      
      Object.entries(dayCount).forEach(([day, count]) => {
        if (count > maxCount) {
          mostActiveDay = day;
          maxCount = count;
        }
      });
      
      return {
        categorySummary,
        monthlyTrend,
        avgTransaction: Math.round(avgTransaction * 100) / 100,
        totalTransactions: transactions.length,
        mostActiveDay,
      };
    } catch (error) {
      this.logger.error(`Error generating dashboard metrics: ${error.message}`);
      throw error;
    }
  }
}
