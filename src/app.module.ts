import { Module } from '@nestjs/common';
// Comentar o eliminar las importaciones que no existen
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PlansModule } from './plans/plans.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { SupabaseModule } from './database/supabase.module';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { PaymentMethodsModule } from './payment-methods/payment-methods.module';
import { InputMethodsModule } from './input-methods/input-methods.module';
import { TransactionsModule } from './transactions/transactions.module';
import { AccountsModule } from './accounts/accounts.module';
import { MetricsModule } from './metrics/metrics.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    PlansModule,
    SubscriptionsModule,
    CategoriesModule,
    PaymentMethodsModule,
    InputMethodsModule,
    TransactionsModule,
    AccountsModule,
    SupabaseModule,
    MetricsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
