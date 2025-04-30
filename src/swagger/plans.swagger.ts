import { applyDecorators } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';

export function FindAllPlansDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Get all plans' }),
    ApiOkResponse({
      description: 'Returns all plans',
      schema: {
        properties: {
          plans: {
            type: 'array',
            items: { $ref: '#/components/schemas/Plan' },
            example: [
              {
                id: '550e8400-e29b-41d4-a716-446655440000',
                name: 'Basic',
                description: 'Basic plan with limited features',
                price: 9.99,
                features: { projectLimit: 5, storageLimit: '1GB' },
                maxUsage: 50,
                isActive: true,
                created_at: '2023-06-01T12:00:00Z',
                updated_at: '2023-06-01T12:00:00Z',
              },
              {
                id: '550e8400-e29b-41d4-a716-446655440001',
                name: 'Pro',
                description: 'Premium plan with all features',
                price: 19.99,
                features: { projectLimit: 10, storageLimit: '5GB' },
                maxUsage: 100,
                isActive: true,
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

export function FindOnePlanDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Get plan by ID' }),
    ApiParam({
      name: 'id',
      type: 'string',
      description: 'Plan ID',
      example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    ApiOkResponse({
      description: 'Returns a single plan by ID',
      schema: {
        properties: {
          plan: {
            $ref: '#/components/schemas/Plan',
            example: {
              id: '550e8400-e29b-41d4-a716-446655440000',
              name: 'Pro',
              description: 'Premium plan with all features',
              price: 19.99,
              features: { projectLimit: 10, storageLimit: '5GB' },
              maxUsage: 100,
              isActive: true,
              created_at: '2023-06-01T12:00:00Z',
              updated_at: '2023-06-01T12:00:00Z',
            },
          },
        },
      },
    }),
  );
}

export function CreatePlanDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Create a new plan' }),
    ApiCreatedResponse({
      description: 'Plan created successfully',
      schema: {
        properties: {
          plan: { $ref: '#/components/schemas/Plan' },
          message: { type: 'string', example: 'Plan created successfully' },
        },
      },
    }),
  );
}

export function UpdatePlanDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Update an existing plan' }),
    ApiParam({
      name: 'id',
      type: 'string',
      description: 'Plan ID',
      example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    ApiOkResponse({
      description: 'Plan updated successfully',
      schema: {
        properties: {
          plan: { $ref: '#/components/schemas/Plan' },
          message: { type: 'string', example: 'Plan updated successfully' },
        },
      },
    }),
  );
}

export function DeletePlanDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Delete a plan' }),
    ApiParam({
      name: 'id',
      type: 'string',
      description: 'Plan ID',
      example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    ApiOkResponse({
      description: 'Plan deleted successfully',
      schema: {
        properties: {
          message: { type: 'string', example: 'Plan deleted successfully' },
        },
      },
    }),
  );
}
