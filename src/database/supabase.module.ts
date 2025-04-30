import { Global, Module } from '@nestjs/common';
import { supabaseClient } from './supabase.client';
import { SupabaseService } from './supabase.service';

@Global()
@Module({
  providers: [
    {
      provide: 'SUPABASE_CLIENT',
      useValue: supabaseClient,
    },
    SupabaseService,
  ],
  exports: ['SUPABASE_CLIENT', SupabaseService],
})
export class SupabaseModule {}
