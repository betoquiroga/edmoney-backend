export interface TransactionData {
  id: string;
  amount: number;
  date: string;
  description?: string;
  category?: {
    id: string;
    name: string;
  };
}

export interface CategoryData {
  id: string;
  name: string;
  total: number;
  count: number;
}

export interface MetricsResultDto {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  recentTransactions: TransactionData[];
  topCategories: CategoryData[];
  period: string;
} 