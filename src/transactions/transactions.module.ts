import { Module } from '@nestjs/common';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { SupabaseModule } from '../database/supabase.module';
import { CategoriesModule } from '../categories/categories.module';

@Module({
  imports: [SupabaseModule, CategoriesModule],
  controllers: [TransactionsController],
  providers: [TransactionsService],
  exports: [TransactionsService],
})
export class TransactionsModule {}
