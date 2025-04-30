import { applyDecorators } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { PaymentMethodType } from '../payment-methods/entities/payment-method.entity';

export function FindAllPaymentMethodsDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Get all payment methods' }),
    ApiQuery({
      name: 'user_id',
      type: 'string',
      required: false,
      description: 'Filter payment methods by user ID',
    }),
    ApiQuery({
      name: 'type',
      enum: PaymentMethodType,
      required: false,
      description: 'Filter payment methods by type',
    }),
    ApiQuery({
      name: 'is_default',
      type: 'boolean',
      required: false,
      description: 'Filter by default/custom payment methods',
    }),
    ApiOkResponse({
      description: 'Returns all payment methods',
      schema: {
        properties: {
          paymentMethods: {
            type: 'array',
            items: { $ref: '#/components/schemas/PaymentMethod' },
            example: [
              {
                id: '550e8400-e29b-41d4-a716-446655440000',
                user_id: null,
                name: 'Cash',
                type: PaymentMethodType.CASH,
                icon: 'money-bill',
                is_default: true,
                is_active: true,
                created_at: '2023-06-01T12:00:00Z',
                updated_at: '2023-06-01T12:00:00Z',
              },
              {
                id: '550e8400-e29b-41d4-a716-446655440001',
                user_id: '550e8400-e29b-41d4-a716-446655441111',
                name: 'My Visa Credit Card',
                type: PaymentMethodType.CREDIT_CARD,
                icon: 'credit-card',
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

export function FindOnePaymentMethodDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Get payment method by ID' }),
    ApiParam({
      name: 'id',
      type: 'string',
      description: 'Payment Method ID',
      example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    ApiOkResponse({
      description: 'Returns a single payment method by ID',
      schema: {
        properties: {
          paymentMethod: {
            $ref: '#/components/schemas/PaymentMethod',
            example: {
              id: '550e8400-e29b-41d4-a716-446655440000',
              user_id: null,
              name: 'Cash',
              type: PaymentMethodType.CASH,
              icon: 'money-bill',
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

export function FindUserPaymentMethodsDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Get payment methods for a specific user' }),
    ApiParam({
      name: 'userId',
      type: 'string',
      description: 'User ID',
      example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    ApiQuery({
      name: 'type',
      enum: PaymentMethodType,
      required: false,
      description: 'Filter payment methods by type',
    }),
    ApiOkResponse({
      description: 'Returns all payment methods for the specified user',
      schema: {
        properties: {
          paymentMethods: {
            type: 'array',
            items: { $ref: '#/components/schemas/PaymentMethod' },
            example: [
              {
                id: '550e8400-e29b-41d4-a716-446655440001',
                user_id: '123e4567-e89b-12d3-a456-426614174000',
                name: 'My Visa Credit Card',
                type: PaymentMethodType.CREDIT_CARD,
                icon: 'credit-card',
                is_default: false,
                is_active: true,
                created_at: '2023-06-01T12:00:00Z',
                updated_at: '2023-06-01T12:00:00Z',
              },
              {
                id: '550e8400-e29b-41d4-a716-446655440000',
                user_id: null,
                name: 'Cash',
                type: PaymentMethodType.CASH,
                icon: 'money-bill',
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

export function CreatePaymentMethodDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Create a new payment method' }),
    ApiCreatedResponse({
      description: 'Payment method created successfully',
      schema: {
        properties: {
          paymentMethod: {
            $ref: '#/components/schemas/PaymentMethod',
            example: {
              id: '550e8400-e29b-41d4-a716-446655440001',
              user_id: '550e8400-e29b-41d4-a716-446655441111',
              name: 'My Visa Credit Card',
              type: PaymentMethodType.CREDIT_CARD,
              icon: 'credit-card',
              is_default: false,
              is_active: true,
              created_at: '2023-06-01T12:00:00Z',
              updated_at: '2023-06-01T12:00:00Z',
            },
          },
          message: {
            type: 'string',
            example: 'Payment method created successfully',
          },
        },
      },
    }),
  );
}

export function UpdatePaymentMethodDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Update an existing payment method' }),
    ApiParam({
      name: 'id',
      type: 'string',
      description: 'Payment Method ID',
      example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    ApiOkResponse({
      description: 'Payment method updated successfully',
      schema: {
        properties: {
          paymentMethod: {
            $ref: '#/components/schemas/PaymentMethod',
            example: {
              id: '550e8400-e29b-41d4-a716-446655440001',
              user_id: '550e8400-e29b-41d4-a716-446655441111',
              name: 'Updated Visa Credit Card',
              type: PaymentMethodType.CREDIT_CARD,
              icon: 'credit-card',
              is_default: false,
              is_active: true,
              created_at: '2023-06-01T12:00:00Z',
              updated_at: '2023-06-15T12:00:00Z',
            },
          },
          message: {
            type: 'string',
            example: 'Payment method updated successfully',
          },
        },
      },
    }),
  );
}

export function DeletePaymentMethodDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Delete a payment method' }),
    ApiParam({
      name: 'id',
      type: 'string',
      description: 'Payment Method ID',
      example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    ApiOkResponse({
      description: 'Payment method deleted successfully',
      schema: {
        properties: {
          message: {
            type: 'string',
            example: 'Payment method deleted successfully',
          },
        },
      },
    }),
  );
}
