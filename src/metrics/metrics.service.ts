import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../database/supabase.service';
import { MetricsResultDto, TransactionData, CategoryData } from './dto/metrics-result.dto';

@Injectable()
export class MetricsService {
  private readonly logger = new Logger(MetricsService.name);
  
  constructor(private readonly supabaseService: SupabaseService) {}

  /**
   * Obtiene las métricas para un usuario específico
   * @param userId ID del usuario
   * @param period Período de tiempo ('week', 'month', 'quarter', 'year')
   * @returns Métricas calculadas
   */
  async getMetrics(userId: string, period: string = 'month'): Promise<MetricsResultDto> {
    this.logger.log(`Obteniendo métricas para el usuario: ${userId}, período: ${period}`);
    
    const supabaseClient = this.supabaseService.getClient();

    // Validar y establecer el período
    const validPeriods = ['week', 'month', 'quarter', 'year'];
    if (!validPeriods.includes(period)) {
      period = 'month'; // Usar valor predeterminado si no es válido
    }

    try {
      // Obtener total de ingresos sin restricción de fechas
      const { data: incomesData, error: incomesError } = await supabaseClient
        .from('transactions')
        .select('amount')
        .eq('user_id', userId)
        .eq('type', 'income');

      if (incomesError) {
        this.logger.error(`Error al obtener ingresos: ${incomesError.message}`);
        throw incomesError;
      }
      
      // Obtener total de gastos sin restricción de fechas
      const { data: expensesData, error: expensesError } = await supabaseClient
        .from('transactions')
        .select('amount')
        .eq('user_id', userId)
        .eq('type', 'expense');

      if (expensesError) {
        this.logger.error(`Error al obtener gastos: ${expensesError.message}`);
        throw expensesError;
      }

      // Calcular totales
      const totalIncome = incomesData.reduce((acc, curr) => acc + Number(curr.amount), 0);
      const totalExpense = expensesData.reduce((acc, curr) => acc + Number(curr.amount), 0);
      const balance = totalIncome - totalExpense;

      // Obtener transacciones recientes
      const { data: recentTransactions, error: recentError } = await supabaseClient
        .from('transactions')
        .select(`
          id,
          amount,
          description,
          transaction_date,
          type,
          category_id
        `)
        .eq('user_id', userId)
        .order('transaction_date', { ascending: false })
        .limit(5);

      if (recentError) {
        this.logger.error(`Error al obtener transacciones recientes: ${recentError.message}`);
        throw recentError;
      }

      // Obtener categorías para las transacciones encontradas
      let topCategories = [];
      if (recentTransactions.length > 0) {
        const categoryIds = recentTransactions
          .map(t => t.category_id)
          .filter(Boolean);
          
        if (categoryIds.length > 0) {
          const { data: categories, error: categoriesError } = await supabaseClient
            .from('categories')
            .select(`id, name`)
            .in('id', categoryIds);

          if (categoriesError) {
            this.logger.error(`Error al obtener categorías: ${categoriesError.message}`);
          } else {
            topCategories = categories;
          }
        }
      }

      // Crear mapa de categorías por ID para acceso rápido
      const categoriesMap = topCategories.reduce((map, cat) => {
        map[cat.id] = cat.name;
        return map;
      }, {});
      
      // Transformar datos de transacciones
      const formattedTransactions: TransactionData[] = recentTransactions.map(t => ({
        id: t.id,
        amount: Number(t.amount),
        date: t.transaction_date,
        description: t.description,
        category: t.category_id && categoriesMap[t.category_id] ? {
          id: t.category_id,
          name: categoriesMap[t.category_id]
        } : undefined
      }));

      // Agrupar transacciones por categoría para formar topCategories
      const categorySums: Record<string, { total: number; count: number; name: string }> = {};
      recentTransactions.forEach(tx => {
        if (tx.category_id && tx.type === 'expense') {
          if (!categorySums[tx.category_id]) {
            categorySums[tx.category_id] = {
              total: 0,
              count: 0,
              name: categoriesMap[tx.category_id] || 'Sin categoría'
            };
          }
          categorySums[tx.category_id].total += Number(tx.amount);
          categorySums[tx.category_id].count += 1;
        }
      });
      
      // Transformar a formato esperado
      const formattedCategories: CategoryData[] = Object.entries(categorySums).map(([id, data]) => ({
        id,
        name: data.name,
        total: data.total,
        count: data.count
      })).sort((a, b) => b.total - a.total);

      const result: MetricsResultDto = {
        totalIncome,
        totalExpense,
        balance,
        recentTransactions: formattedTransactions,
        topCategories: formattedCategories,
        period
      };
      
      return result;
    } catch (error) {
      this.logger.error(`Error al obtener métricas: ${error.message}`, error.stack);
      throw error;
    }
  }
} 