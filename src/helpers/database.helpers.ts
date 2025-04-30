import { supabaseClient } from '../database/supabase.client';

/**
 * Executes a query to fetch data from Supabase
 * @param table Table name
 * @param columns Columns to select
 * @param filters Object with filter conditions
 * @param options Additional query options
 * @returns Promise with the query result
 */
export const fetchData = async (
  table: string,
  columns: string = '*',
  filters?: Record<string, any>,
  options?: {
    limit?: number;
    offset?: number;
    orderBy?: { column: string; ascending?: boolean };
  },
) => {
  let query = supabaseClient.from(table).select(columns);

  // Apply filters if they exist
  if (filters) {
    for (const [key, value] of Object.entries(filters)) {
      query = query.eq(key, value);
    }
  }

  // Apply pagination if limit is provided
  if (options?.limit) {
    query = query.limit(options.limit);
  }

  // Apply offset if provided
  if (options?.offset) {
    query = query.range(
      options.offset,
      options.offset + (options.limit || 10) - 1,
    );
  }

  // Apply ordering if provided
  if (options?.orderBy) {
    const { column, ascending = true } = options.orderBy;
    query = query.order(column, { ascending });
  }

  return await query;
};

/**
 * Inserts data into a Supabase table
 * @param table Table name
 * @param data Data to insert
 * @returns Promise with the insert result
 */
export const insertData = async (table: string, data: Record<string, any>) => {
  return await supabaseClient.from(table).insert(data).select();
};

/**
 * Updates data in a Supabase table
 * @param table Table name
 * @param data Data to update
 * @param filters Filter conditions to identify rows to update
 * @returns Promise with the update result
 */
export const updateData = async (
  table: string,
  data: Record<string, any>,
  filters: Record<string, any>,
) => {
  let query = supabaseClient.from(table).update(data);

  // Apply filters
  for (const [key, value] of Object.entries(filters)) {
    query = query.eq(key, value);
  }

  return await query.select();
};

/**
 * Deletes data from a Supabase table
 * @param table Table name
 * @param filters Filter conditions to identify rows to delete
 * @returns Promise with the delete result
 */
export const deleteData = async (
  table: string,
  filters: Record<string, any>,
) => {
  let query = supabaseClient.from(table).delete();

  // Apply filters
  for (const [key, value] of Object.entries(filters)) {
    query = query.eq(key, value);
  }

  return await query;
};
