import {
  Transaction,
  TransactionType,
} from 'src/transactions/entities/transaction.entity';

export const TRANSACTION_EXAMPLE: Transaction = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  user_id: '550e8400-e29b-41d4-a716-446655441111',
  category_id: '550e8400-e29b-41d4-a716-446655442222',
  payment_method_id: '550e8400-e29b-41d4-a716-446655443333',
  input_method_id: '550e8400-e29b-41d4-a716-446655444444',
  type: TransactionType.EXPENSE,
  amount: 99.99,
  currency: 'USD',
  transaction_date: new Date('2023-06-01T12:00:00Z'),
  description: 'Grocery shopping at Walmart',
  is_recurring: false,
  recurring_id: null,
  created_at: new Date('2023-06-01T12:00:00Z'),
  updated_at: new Date('2023-06-01T12:00:00Z'),
};

export const CREATE_TRANSACTION_EXAMPLE = {
  user_id: '550e8400-e29b-41d4-a716-446655441111',
  category_id: '550e8400-e29b-41d4-a716-446655442222',
  payment_method_id: '550e8400-e29b-41d4-a716-446655443333',
  input_method_id: '550e8400-e29b-41d4-a716-446655444444',
  type: 'expense',
  amount: '99.99',
  currency: 'USD',
  transaction_date: '2023-06-01T12:00:00Z',
  description: 'Grocery shopping at Walmart',
  is_recurring: false,
};

export const UPDATE_TRANSACTION_EXAMPLE = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  user_id: '550e8400-e29b-41d4-a716-446655441111',
  amount: '149.99',
  description: 'Updated grocery shopping at Walmart',
};

export const TRANSACTION_RESPONSE_EXAMPLE = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  user_id: '550e8400-e29b-41d4-a716-446655441111',
  category_id: '550e8400-e29b-41d4-a716-446655442222',
  payment_method_id: '550e8400-e29b-41d4-a716-446655443333',
  input_method_id: '550e8400-e29b-41d4-a716-446655444444',
  type: 'expense',
  amount: 99.99,
  currency: 'USD',
  transaction_date: '2023-06-01T12:00:00.000Z',
  description: 'Grocery shopping at Walmart',
  is_recurring: false,
  recurring_id: null,
  created_at: '2023-06-01T12:00:00.000Z',
  updated_at: '2023-06-01T12:00:00.000Z',
};

export const TRANSACTIONS_LIST_RESPONSE_EXAMPLE = [
  {
    id: '550e8400-e29b-41d4-a716-446655440000',
    user_id: '550e8400-e29b-41d4-a716-446655441111',
    category_id: '550e8400-e29b-41d4-a716-446655442222',
    payment_method_id: '550e8400-e29b-41d4-a716-446655443333',
    input_method_id: '550e8400-e29b-41d4-a716-446655444444',
    type: 'expense',
    amount: 99.99,
    currency: 'USD',
    transaction_date: '2023-06-01T12:00:00.000Z',
    description: 'Grocery shopping at Walmart',
    is_recurring: false,
    recurring_id: null,
    created_at: '2023-06-01T12:00:00.000Z',
    updated_at: '2023-06-01T12:00:00.000Z',
  },
  {
    id: '660e8400-e29b-41d4-a716-446655550000',
    user_id: '550e8400-e29b-41d4-a716-446655441111',
    category_id: '660e8400-e29b-41d4-a716-446655552222',
    payment_method_id: '770e8400-e29b-41d4-a716-446655553333',
    input_method_id: '550e8400-e29b-41d4-a716-446655444444',
    type: 'income',
    amount: 1500.0,
    currency: 'USD',
    transaction_date: '2023-06-15T09:30:00.000Z',
    description: 'Salary payment',
    is_recurring: true,
    recurring_id: '880e8400-e29b-41d4-a716-446655554444',
    created_at: '2023-06-15T09:30:00.000Z',
    updated_at: '2023-06-15T09:30:00.000Z',
  },
];
