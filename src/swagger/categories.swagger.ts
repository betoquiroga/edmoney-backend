import { applyDecorators } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { TransactionType } from '../categories/entities/category.entity';

export function FindAllCategoriesDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Get all categories' }),
    ApiQuery({
      name: 'user_id',
      type: 'string',
      required: false,
      description: 'Filter categories by user ID',
    }),
    ApiQuery({
      name: 'type',
      enum: TransactionType,
      required: false,
      description: 'Filter categories by transaction type',
    }),
    ApiQuery({
      name: 'is_default',
      type: 'boolean',
      required: false,
      description: 'Filter by default/custom categories',
    }),
    ApiOkResponse({
      description: 'Returns all categories',
      schema: {
        properties: {
          categories: {
            type: 'array',
            items: { $ref: '#/components/schemas/Category' },
            example: [
              {
                id: '550e8400-e29b-41d4-a716-446655440000',
                user_id: null,
                name: 'Groceries',
                type: TransactionType.EXPENSE,
                icon: 'shopping-cart',
                is_default: true,
                is_active: true,
                created_at: '2023-06-01T12:00:00Z',
                updated_at: '2023-06-01T12:00:00Z',
              },
              {
                id: '550e8400-e29b-41d4-a716-446655440001',
                user_id: '550e8400-e29b-41d4-a716-446655441111',
                name: 'My Salary',
                type: TransactionType.INCOME,
                icon: 'wallet',
                is_default: false,
                is_active: true,
                created_at: '2023-06-01T12:00:00Z',
                updated_at: '2023-06-01T12:00:00Z',
              },
            ],
          },
        },
      },
    }),
  );
}

export function FindOneCategoryDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Get category by ID' }),
    ApiParam({
      name: 'id',
      type: 'string',
      description: 'Category ID',
      example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    ApiOkResponse({
      description: 'Returns a single category by ID',
      schema: {
        properties: {
          category: {
            $ref: '#/components/schemas/Category',
            example: {
              id: '550e8400-e29b-41d4-a716-446655440000',
              user_id: null,
              name: 'Groceries',
              type: TransactionType.EXPENSE,
              icon: 'shopping-cart',
              is_default: true,
              is_active: true,
              created_at: '2023-06-01T12:00:00Z',
              updated_at: '2023-06-01T12:00:00Z',
            },
          },
        },
      },
    }),
  );
}

export function FindUserCategoriesDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Get categories for a specific user' }),
    ApiParam({
      name: 'userId',
      type: 'string',
      description: 'User ID',
      example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    ApiQuery({
      name: 'type',
      enum: TransactionType,
      required: false,
      description: 'Filter categories by transaction type',
    }),
    ApiOkResponse({
      description: 'Returns all categories for the specified user',
      schema: {
        properties: {
          categories: {
            type: 'array',
            items: { $ref: '#/components/schemas/Category' },
            example: [
              {
                id: '550e8400-e29b-41d4-a716-446655440000',
                user_id: '123e4567-e89b-12d3-a456-426614174000',
                name: 'My Salary',
                type: TransactionType.INCOME,
                icon: 'wallet',
                is_default: false,
                is_active: true,
                created_at: '2023-06-01T12:00:00Z',
                updated_at: '2023-06-01T12:00:00Z',
              },
              {
                id: '550e8400-e29b-41d4-a716-446655440001',
                user_id: null,
                name: 'Groceries',
                type: TransactionType.EXPENSE,
                icon: 'shopping-cart',
                is_default: true,
                is_active: true,
                created_at: '2023-06-01T12:00:00Z',
                updated_at: '2023-06-01T12:00:00Z',
              },
            ],
          },
        },
      },
    }),
  );
}

export function CreateCategoryDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Create a new category' }),
    ApiCreatedResponse({
      description: 'Category created successfully',
      schema: {
        properties: {
          category: {
            $ref: '#/components/schemas/Category',
            example: {
              id: '550e8400-e29b-41d4-a716-446655440000',
              user_id: '550e8400-e29b-41d4-a716-446655441111',
              name: 'My Salary',
              type: TransactionType.INCOME,
              icon: 'wallet',
              is_default: false,
              is_active: true,
              created_at: '2023-06-01T12:00:00Z',
              updated_at: '2023-06-01T12:00:00Z',
            },
          },
          message: { type: 'string', example: 'Category created successfully' },
        },
      },
    }),
  );
}

export function UpdateCategoryDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Update an existing category' }),
    ApiParam({
      name: 'id',
      type: 'string',
      description: 'Category ID',
      example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    ApiOkResponse({
      description: 'Category updated successfully',
      schema: {
        properties: {
          category: {
            $ref: '#/components/schemas/Category',
            example: {
              id: '550e8400-e29b-41d4-a716-446655440000',
              user_id: '550e8400-e29b-41d4-a716-446655441111',
              name: 'Updated Salary',
              type: TransactionType.INCOME,
              icon: 'money',
              is_default: false,
              is_active: true,
              created_at: '2023-06-01T12:00:00Z',
              updated_at: '2023-06-15T12:00:00Z',
            },
          },
          message: { type: 'string', example: 'Category updated successfully' },
        },
      },
    }),
  );
}

export function DeleteCategoryDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Delete a category' }),
    ApiParam({
      name: 'id',
      type: 'string',
      description: 'Category ID',
      example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    ApiOkResponse({
      description: 'Category deleted successfully',
      schema: {
        properties: {
          message: {
            type: 'string',
            example: 'Category deleted successfully',
          },
        },
      },
    }),
  );
}
