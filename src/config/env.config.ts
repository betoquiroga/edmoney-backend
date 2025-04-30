import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export const env = {
  supabase: {
    url: process.env.SUPABASE_URL || 'https://your-project.supabase.co',
    key: process.env.SUPABASE_KEY || 'your-supabase-anon-key',
    serviceRoleKey:
      process.env.SUPABASE_SERVICE_ROLE_KEY || 'your-supabase-service-role-key',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key-for-jwt-tokens',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },
  server: {
    port: parseInt(process.env.PORT || '3000', 10),
  },
  migrations: {
    run: process.env.RUN_MIGRATIONS === 'true',
    nodeEnv: process.env.NODE_ENV || 'development',
  },
};
