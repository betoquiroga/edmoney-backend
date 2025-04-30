import { Injectable, NotFoundException } from '@nestjs/common';
import { Account } from './entities/account.entity';
import { CreateAccountDto } from './dtos/create-account.dto';
import { UpdateAccountDto } from './dtos/update-account.dto';
import { SupabaseService } from '../database/supabase.service';

@Injectable()
export class AccountsService {
  private readonly TABLE_NAME = 'accounts';

  constructor(private readonly supabaseService: SupabaseService) {}

  async create(createAccountDto: CreateAccountDto): Promise<Account> {
    const now = new Date();

    // Convert string to number for initial_balance or use default 0
    const initialBalance = createAccountDto.initial_balance
      ? parseFloat(createAccountDto.initial_balance)
      : 0;

    // If is_active is not provided, default to true
    const isActive =
      createAccountDto.is_active !== undefined
        ? createAccountDto.is_active
        : true;

    const accountData = {
      user_id: createAccountDto.user_id,
      name: createAccountDto.name,
      type: createAccountDto.type,
      initial_balance: initialBalance,
      current_balance: initialBalance, // Initially, current balance equals initial balance
      currency: createAccountDto.currency,
      is_active: isActive,
      created_at: now,
      updated_at: now,
    };

    const { data, error } = await this.supabaseService
      .getClient()
      .from(this.TABLE_NAME)
      .insert(accountData)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create account: ${error.message}`);
    }

    return data as Account;
  }

  async findAll(userId: string): Promise<Account[]> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from(this.TABLE_NAME)
      .select('*')
      .eq('user_id', userId)
      .order('name', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch accounts: ${error.message}`);
    }

    return data as Account[];
  }

  async findOne(id: string, userId: string): Promise<Account> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from(this.TABLE_NAME)
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      throw new NotFoundException(`Account with ID ${id} not found`);
    }

    return data as Account;
  }

  async update(
    id: string,
    updateAccountDto: UpdateAccountDto,
  ): Promise<Account> {
    // First check if the account exists and belongs to the user
    const existingAccount = await this.findOne(id, updateAccountDto.user_id);

    const updateData: Record<string, any> = {
      ...updateAccountDto,
      updated_at: new Date(),
    };

    // Remove id from the update data since we don't want to update the primary key
    delete updateData.id;

    // Handle initial_balance conversion if provided
    if (updateAccountDto.initial_balance) {
      const newInitialBalance = parseFloat(updateAccountDto.initial_balance);
      updateData.initial_balance = newInitialBalance;

      // If initial balance changes, adjust current balance by the difference
      const difference = newInitialBalance - existingAccount.initial_balance;
      updateData.current_balance = existingAccount.current_balance + difference;
    }

    const { data, error } = await this.supabaseService
      .getClient()
      .from(this.TABLE_NAME)
      .update(updateData)
      .eq('id', id)
      .eq('user_id', updateAccountDto.user_id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update account: ${error.message}`);
    }

    return data as Account;
  }

  async remove(id: string, userId: string): Promise<void> {
    // First check if the account exists and belongs to the user
    await this.findOne(id, userId);

    const { error } = await this.supabaseService
      .getClient()
      .from(this.TABLE_NAME)
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      throw new Error(`Failed to delete account: ${error.message}`);
    }
  }
}
