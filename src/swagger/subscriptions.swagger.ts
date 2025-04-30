import { applyDecorators } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { SubscriptionStatus } from '../subscriptions/entities/subscription.entity';

export function FindAllSubscriptionsDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Get all subscriptions' }),
    ApiQuery({
      name: 'user_id',
      type: 'string',
      required: false,
      description: 'Filter subscriptions by user ID',
    }),
    ApiOkResponse({
      description: 'Returns all subscriptions',
      schema: {
        properties: {
          subscriptions: {
            type: 'array',
            items: { $ref: '#/components/schemas/Subscription' },
            example: [
              {
                id: '550e8400-e29b-41d4-a716-446655440000',
                user_id: '550e8400-e29b-41d4-a716-446655441111',
                plan_id: '550e8400-e29b-41d4-a716-446655442222',
                status: SubscriptionStatus.ACTIVE,
                start_date: '2023-01-01T00:00:00Z',
                end_date: '2024-01-01T00:00:00Z',
                current_period_start: '2023-06-01T00:00:00Z',
                current_period_end: '2023-07-01T00:00:00Z',
                paypal_subscription_id: 'I-BW452GLLEP1G',
                created_at: '2023-06-01T12:00:00Z',
                updated_at: '2023-06-01T12:00:00Z',
              },
              {
                id: '550e8400-e29b-41d4-a716-446655440001',
                user_id: '550e8400-e29b-41d4-a716-446655441112',
                plan_id: '550e8400-e29b-41d4-a716-446655442223',
                status: SubscriptionStatus.PENDING,
                start_date: '2023-02-01T00:00:00Z',
                end_date: '2024-02-01T00:00:00Z',
                current_period_start: '2023-06-01T00:00:00Z',
                current_period_end: '2023-07-01T00:00:00Z',
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

export function FindOneSubscriptionDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Get subscription by ID' }),
    ApiParam({
      name: 'id',
      type: 'string',
      description: 'Subscription ID',
      example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    ApiOkResponse({
      description: 'Returns a single subscription by ID',
      schema: {
        properties: {
          subscription: {
            $ref: '#/components/schemas/Subscription',
            example: {
              id: '550e8400-e29b-41d4-a716-446655440000',
              user_id: '550e8400-e29b-41d4-a716-446655441111',
              plan_id: '550e8400-e29b-41d4-a716-446655442222',
              status: SubscriptionStatus.ACTIVE,
              start_date: '2023-01-01T00:00:00Z',
              end_date: '2024-01-01T00:00:00Z',
              current_period_start: '2023-06-01T00:00:00Z',
              current_period_end: '2023-07-01T00:00:00Z',
              paypal_subscription_id: 'I-BW452GLLEP1G',
              created_at: '2023-06-01T12:00:00Z',
              updated_at: '2023-06-01T12:00:00Z',
            },
          },
        },
      },
    }),
  );
}

export function FindUserSubscriptionsDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Get subscriptions for a specific user' }),
    ApiParam({
      name: 'userId',
      type: 'string',
      description: 'User ID',
      example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    ApiOkResponse({
      description: 'Returns all subscriptions for the specified user',
      schema: {
        properties: {
          subscriptions: {
            type: 'array',
            items: { $ref: '#/components/schemas/Subscription' },
            example: [
              {
                id: '550e8400-e29b-41d4-a716-446655440000',
                user_id: '550e8400-e29b-41d4-a716-446655441111',
                plan_id: '550e8400-e29b-41d4-a716-446655442222',
                status: SubscriptionStatus.ACTIVE,
                start_date: '2023-01-01T00:00:00Z',
                end_date: '2024-01-01T00:00:00Z',
                current_period_start: '2023-06-01T00:00:00Z',
                current_period_end: '2023-07-01T00:00:00Z',
                paypal_subscription_id: 'I-BW452GLLEP1G',
                created_at: '2023-06-01T12:00:00Z',
                updated_at: '2023-06-01T12:00:00Z',
              },
              {
                id: '550e8400-e29b-41d4-a716-446655440001',
                user_id: '550e8400-e29b-41d4-a716-446655441111',
                plan_id: '550e8400-e29b-41d4-a716-446655442223',
                status: SubscriptionStatus.CANCELED,
                start_date: '2022-01-01T00:00:00Z',
                end_date: '2023-01-01T00:00:00Z',
                created_at: '2022-01-01T12:00:00Z',
                updated_at: '2023-01-01T12:00:00Z',
              },
            ],
          },
        },
      },
    }),
  );
}

export function CreateSubscriptionDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Create a new subscription' }),
    ApiCreatedResponse({
      description: 'Subscription created successfully',
      schema: {
        properties: {
          subscription: { $ref: '#/components/schemas/Subscription' },
          message: {
            type: 'string',
            example: 'Subscription created successfully',
          },
        },
      },
    }),
  );
}

export function UpdateSubscriptionDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Update an existing subscription' }),
    ApiParam({
      name: 'id',
      type: 'string',
      description: 'Subscription ID',
      example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    ApiOkResponse({
      description: 'Subscription updated successfully',
      schema: {
        properties: {
          subscription: { $ref: '#/components/schemas/Subscription' },
          message: {
            type: 'string',
            example: 'Subscription updated successfully',
          },
        },
      },
    }),
  );
}

export function CancelSubscriptionDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Cancel a subscription' }),
    ApiParam({
      name: 'id',
      type: 'string',
      description: 'Subscription ID',
      example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    ApiOkResponse({
      description: 'Subscription canceled successfully',
      schema: {
        properties: {
          subscription: { $ref: '#/components/schemas/Subscription' },
          message: {
            type: 'string',
            example: 'Subscription canceled successfully',
          },
        },
      },
    }),
  );
}

export function DeleteSubscriptionDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Delete a subscription' }),
    ApiParam({
      name: 'id',
      type: 'string',
      description: 'Subscription ID',
      example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    ApiOkResponse({
      description: 'Subscription deleted successfully',
      schema: {
        properties: {
          message: {
            type: 'string',
            example: 'Subscription deleted successfully',
          },
        },
      },
    }),
  );
}
