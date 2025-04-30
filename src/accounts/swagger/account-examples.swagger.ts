import { Account, AccountType } from '../entities/account.entity';

export const ACCOUNT_EXAMPLE: Account = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  user_id: '550e8400-e29b-41d4-a716-446655441111',
  name: 'BCP Checking Account',
  type: AccountType.BANK,
  initial_balance: 1000,
  current_balance: 1250.5,
  currency: 'USD',
  is_active: true,
  created_at: new Date('2023-06-01T12:00:00Z'),
  updated_at: new Date('2023-06-01T12:00:00Z'),
};

export const CREATE_ACCOUNT_EXAMPLE = {
  user_id: '550e8400-e29b-41d4-a716-446655441111',
  name: 'BCP Checking Account',
  type: 'bank',
  initial_balance: '1000.00',
  currency: 'USD',
  is_active: true,
};

export const UPDATE_ACCOUNT_EXAMPLE = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  name: 'BCP Savings Account',
  is_active: true,
};

export const ACCOUNT_RESPONSE_EXAMPLE = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  user_id: '550e8400-e29b-41d4-a716-446655441111',
  name: 'BCP Checking Account',
  type: 'bank',
  initial_balance: 1000,
  current_balance: 1250.5,
  currency: 'USD',
  is_active: true,
  created_at: '2023-06-01T12:00:00.000Z',
  updated_at: '2023-06-01T12:00:00.000Z',
};

export const ACCOUNTS_LIST_RESPONSE_EXAMPLE = [
  {
    id: '550e8400-e29b-41d4-a716-446655440000',
    user_id: '550e8400-e29b-41d4-a716-446655441111',
    name: 'BCP Checking Account',
    type: 'bank',
    initial_balance: 1000,
    current_balance: 1250.5,
    currency: 'USD',
    is_active: true,
    created_at: '2023-06-01T12:00:00.000Z',
    updated_at: '2023-06-01T12:00:00.000Z',
  },
  {
    id: '660e8400-e29b-41d4-a716-446655550000',
    user_id: '550e8400-e29b-41d4-a716-446655441111',
    name: 'Cash',
    type: 'cash',
    initial_balance: 500,
    current_balance: 350.75,
    currency: 'USD',
    is_active: true,
    created_at: '2023-06-01T12:00:00.000Z',
    updated_at: '2023-06-01T12:00:00.000Z',
  },
];
