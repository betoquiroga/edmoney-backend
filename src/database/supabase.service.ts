import { Inject, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import {
  fetchData,
  insertData,
  updateData,
  deleteData,
} from '../helpers/database.helpers';

@Injectable()
export class SupabaseService {
  constructor(
    @Inject('SUPABASE_CLIENT')
    private readonly supabaseClient: SupabaseClient,
  ) {}

  /**
   * Get the Supabase client instance
   */
  getClient(): SupabaseClient {
    return this.supabaseClient;
  }

  /**
   * Fetch data from a table
   */
  async fetch(
    table: string,
    columns: string = '*',
    filters?: Record<string, any>,
    options?: {
      limit?: number;
      offset?: number;
      orderBy?: { column: string; ascending?: boolean };
    },
  ) {
    return fetchData(table, columns, filters, options);
  }

  /**
   * Insert data into a table
   */
  async insert(table: string, data: Record<string, any>) {
    return insertData(table, data);
  }

  /**
   * Update data in a table
   */
  async update(
    table: string,
    data: Record<string, any>,
    filters: Record<string, any>,
  ) {
    return updateData(table, data, filters);
  }

  /**
   * Delete data from a table
   */
  async delete(table: string, filters: Record<string, any>) {
    return deleteData(table, filters);
  }
}
