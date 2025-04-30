/**
 * Database query operators
 */
export const DB_OPERATORS = {
  EQUAL: 'eq',
  NOT_EQUAL: 'neq',
  GREATER_THAN: 'gt',
  GREATER_THAN_OR_EQUAL: 'gte',
  LESS_THAN: 'lt',
  LESS_THAN_OR_EQUAL: 'lte',
  LIKE: 'like',
  ILIKE: 'ilike',
  IN: 'in',
  IS: 'is',
} as const;
