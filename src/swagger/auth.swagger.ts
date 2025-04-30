import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export const RegisterDocs = () => {
  return applyDecorators(
    ApiOperation({ summary: 'Register a new user' }),
    ApiResponse({
      status: 201,
      description: 'User registered successfully',
      schema: {
        properties: {
          user: { $ref: '#/components/schemas/User' },
          token: { type: 'string' },
          message: { type: 'string' },
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Bad request',
    }),
  );
};

export const LoginDocs = () => {
  return applyDecorators(
    ApiOperation({ summary: 'Login a user' }),
    ApiResponse({
      status: 200,
      description: 'Login successful',
      schema: {
        properties: {
          user: { $ref: '#/components/schemas/User' },
          token: { type: 'string' },
          message: { type: 'string' },
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized',
    }),
  );
};
