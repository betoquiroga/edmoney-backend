import { Injectable } from '@nestjs/common';
import { SupabaseService } from './database/supabase.service';

@Injectable()
export class AppService {
  constructor(private readonly supabaseService: SupabaseService) {}

  getHello(): string {
    return 'Hello EDteam!';
  }
}
