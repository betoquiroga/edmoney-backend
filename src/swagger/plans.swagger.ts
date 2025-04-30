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
          plan: { $ref: '#/components/schemas/Plan' },
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
