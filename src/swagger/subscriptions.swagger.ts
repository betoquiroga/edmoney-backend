import { applyDecorators } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

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
          subscription: { $ref: '#/components/schemas/Subscription' },
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
