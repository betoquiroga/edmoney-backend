import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { User } from '../users/entities/user.entity';

export const FindAllUsersDocs = () => {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Get all users' }),
    ApiResponse({
      status: 200,
      description: 'Returns all users',
      type: User,
      isArray: true,
    }),
  );
};

export const FindOneUserDocs = () => {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Get a user by ID' }),
    ApiResponse({
      status: 200,
      description: 'Returns the user',
      type: User,
    }),
    ApiResponse({
      status: 404,
      description: 'User not found',
    }),
  );
};

export const UpdateUserDocs = () => {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Update a user' }),
    ApiResponse({
      status: 200,
      description: 'Returns the updated user',
      type: User,
    }),
    ApiResponse({
      status: 404,
      description: 'User not found',
    }),
  );
};

export const DeleteUserDocs = () => {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Delete a user' }),
    ApiResponse({
      status: 200,
      description: 'User deleted successfully',
    }),
    ApiResponse({
      status: 404,
      description: 'User not found',
    }),
  );
};
