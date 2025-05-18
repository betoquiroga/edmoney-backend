import { Injectable } from '@nestjs/common';
import { SupabaseService } from './database/supabase.service';

@Injectable()
export class AppService {
  constructor(private readonly supabaseService: SupabaseService) {}

  getHello(): string {
    return 'Hello EDteam!';
  }

  async checkHealth() {
    try {
      // Prueba la conexión a la base de datos
      const client = this.supabaseService.getClient();
      const { data, error } = await client.from('input_methods').select('id').limit(1);
      
      if (error) {
        return {
          status: 'error',
          timestamp: new Date().toISOString(),
          database: false,
          message: `Database error: ${error.message}`,
        };
      }

      return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        database: true,
        message: 'API is healthy',
      };
    } catch (error) {
      return {
        status: 'error',
        timestamp: new Date().toISOString(),
        database: false,
        message: `Error: ${error.message}`,
      };
    }
  }
}
