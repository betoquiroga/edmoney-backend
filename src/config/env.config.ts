import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export const env = {
  supabase: {
    url: process.env.SUPABASE_URL || 'https://your-project.supabase.co',
    key: process.env.SUPABASE_KEY || 'your-supabase-anon-key',
    accessToken: process.env.SUPABASE_ACCESS_TOKEN || 'your-access-token',
    dbPassword: process.env.SUPABASE_DB_PASSWORD || 'your-db-password',
  },
};
