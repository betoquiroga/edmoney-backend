import { applyDecorators } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

export function FindAllInputMethodsDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Get all input methods' }),
    ApiQuery({
      name: 'is_active',
      type: 'boolean',
      required: false,
      description: 'Filter by active status',
    }),
    ApiOkResponse({
      description: 'Returns all input methods',
      schema: {
        properties: {
          inputMethods: {
            type: 'array',
            items: { $ref: '#/components/schemas/InputMethod' },
            example: [
              {
                id: '550e8400-e29b-41d4-a716-446655440000',
                name: 'manual',
                description:
                  'Manual transaction entry through the user interface',
                is_active: true,
              },
              {
                id: '550e8400-e29b-41d4-a716-446655440001',
                name: 'voice',
                description: 'Voice recognition for transaction input',
                is_active: true,
              },
              {
                id: '550e8400-e29b-41d4-a716-446655440002',
                name: 'image',
                description: 'Receipt scanning for transaction data extraction',
                is_active: false,
              },
            ],
          },
        },
      },
    }),
  );
}

export function FindOneInputMethodDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Get input method by ID' }),
    ApiParam({
      name: 'id',
      type: 'string',
      description: 'Input Method ID',
      example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    ApiOkResponse({
      description: 'Returns a single input method by ID',
      schema: {
        properties: {
          inputMethod: {
            $ref: '#/components/schemas/InputMethod',
            example: {
              id: '550e8400-e29b-41d4-a716-446655440000',
              name: 'manual',
              description:
                'Manual transaction entry through the user interface',
              is_active: true,
            },
          },
        },
      },
    }),
  );
}

export function CreateInputMethodDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Create a new input method' }),
    ApiCreatedResponse({
      description: 'Input method created successfully',
      schema: {
        properties: {
          inputMethod: {
            $ref: '#/components/schemas/InputMethod',
            example: {
              id: '550e8400-e29b-41d4-a716-446655440003',
              name: 'prompt',
              description: 'AI-based prompts for transaction input suggestions',
              is_active: true,
            },
          },
          message: {
            type: 'string',
            example: 'Input method created successfully',
          },
        },
      },
    }),
  );
}

export function UpdateInputMethodDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Update an existing input method' }),
    ApiParam({
      name: 'id',
      type: 'string',
      description: 'Input Method ID',
      example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    ApiOkResponse({
      description: 'Input method updated successfully',
      schema: {
        properties: {
          inputMethod: {
            $ref: '#/components/schemas/InputMethod',
            example: {
              id: '550e8400-e29b-41d4-a716-446655440002',
              name: 'image',
              description:
                'Updated: Advanced OCR for receipt scanning and processing',
              is_active: true,
            },
          },
          message: {
            type: 'string',
            example: 'Input method updated successfully',
          },
        },
      },
    }),
  );
}

export function DeleteInputMethodDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Delete an input method' }),
    ApiParam({
      name: 'id',
      type: 'string',
      description: 'Input Method ID',
      example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    ApiOkResponse({
      description: 'Input method deleted successfully',
      schema: {
        properties: {
          message: {
            type: 'string',
            example: 'Input method deleted successfully',
          },
        },
      },
    }),
  );
}
