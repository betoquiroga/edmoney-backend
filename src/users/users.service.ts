import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../database/supabase.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { IUser } from './interfaces/user.interface';

@Injectable()
export class UsersService {
  private readonly TABLE_NAME = 'users';

  constructor(private readonly supabaseService: SupabaseService) {}

  /**
   * Find a user by ID
   */
  async findById(id: string): Promise<IUser> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from(this.TABLE_NAME)
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return data as IUser;
  }

  /**
   * Find a user by email
   */
  async findByEmail(email: string): Promise<IUser | null> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from(this.TABLE_NAME)
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      return null;
    }

    return data as IUser;
  }

  /**
   * Get all users
   */
  async findAll(): Promise<IUser[]> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from(this.TABLE_NAME)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error('Failed to fetch users');
    }

    return data as IUser[];
  }

  /**
   * Create a new user
   * Note: This method is for internal use only. For user registration, use AuthService
   */
  async create(createUserDto: CreateUserDto, userId?: string): Promise<IUser> {
    // If userId is provided, use it (comes from Supabase Auth)
    const userData = {
      ...(userId && { id: userId }),
      email: createUserDto.email,
      name: createUserDto.name,
      avatar: createUserDto.avatar,
    };

    const { data, error } = await this.supabaseService
      .getClient()
      .from(this.TABLE_NAME)
      .insert(userData)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }

    return data as IUser;
  }

  /**
   * Update a user by ID
   */
  async update(id: string, updateUserDto: UpdateUserDto): Promise<IUser> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from(this.TABLE_NAME)
      .update({
        ...(updateUserDto.email && { email: updateUserDto.email }),
        ...(updateUserDto.name && { name: updateUserDto.name }),
        ...(updateUserDto.avatar && { avatar: updateUserDto.avatar }),
        updated_at: new Date(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update user: ${error.message}`);
    }

    return data as IUser;
  }

  /**
   * Delete a user by ID
   */
  async remove(id: string): Promise<void> {
    const { error } = await this.supabaseService
      .getClient()
      .from(this.TABLE_NAME)
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete user: ${error.message}`);
    }
  }
}
