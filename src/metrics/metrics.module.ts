import { Module } from '@nestjs/common';
import { MetricsController } from '../controllers/metrics.controller';
import { SupabaseModule } from '../database/supabase.module';
import { MetricsService } from './metrics.service';

@Module({
  imports: [SupabaseModule],
  controllers: [MetricsController],
  providers: [MetricsService],
  exports: [MetricsService]
})
export class MetricsModule {} 