import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dtos/create-account.dto';
import { UpdateAccountDto } from './dtos/update-account.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  ACCOUNT_RESPONSE_EXAMPLE,
  ACCOUNTS_LIST_RESPONSE_EXAMPLE,
} from './swagger/account-examples.swagger';

@ApiTags('accounts')
@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new account' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Account created successfully',
    schema: {
      type: 'object',
      example: ACCOUNT_RESPONSE_EXAMPLE,
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  create(@Body() createAccountDto: CreateAccountDto) {
    return this.accountsService.create(createAccountDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all accounts for a user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Accounts retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        example: ACCOUNT_RESPONSE_EXAMPLE,
      },
      example: ACCOUNTS_LIST_RESPONSE_EXAMPLE,
    },
  })
  findAll(@Query('userId') userId: string) {
    return this.accountsService.findAll(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an account by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Account retrieved successfully',
    schema: {
      type: 'object',
      example: ACCOUNT_RESPONSE_EXAMPLE,
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Account not found',
  })
  findOne(@Param('id') id: string, @Query('userId') userId: string) {
    return this.accountsService.findOne(id, userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an account' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Account updated successfully',
    schema: {
      type: 'object',
      example: ACCOUNT_RESPONSE_EXAMPLE,
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Account not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  update(@Param('id') id: string, @Body() updateAccountDto: UpdateAccountDto) {
    if (id !== updateAccountDto.id) {
      updateAccountDto.id = id;
    }
    return this.accountsService.update(id, updateAccountDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an account' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Account deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Account not found',
  })
  remove(@Param('id') id: string, @Query('userId') userId: string) {
    return this.accountsService.remove(id, userId);
  }
}
