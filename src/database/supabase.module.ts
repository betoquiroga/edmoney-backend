import { Global, Module } from '@nestjs/common';
import { supabaseClient } from './supabase.client';

@Global()
@Module({
  providers: [
    {
      provide: 'SUPABASE_CLIENT',
      useValue: supabaseClient,
    },
  ],
  exports: ['SUPABASE_CLIENT'],
})
export class SupabaseModule {}
