import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SupabaseModule } from './database/supabase.module';
import { SupabaseService } from './database/supabase.service';

@Module({
  imports: [SupabaseModule],
  controllers: [AppController],
  providers: [AppService, SupabaseService],
})
export class AppModule {}
