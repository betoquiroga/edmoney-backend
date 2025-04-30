import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PlansModule } from './plans/plans.module';
import { SupabaseModule } from './database/supabase.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [AuthModule, UsersModule, PlansModule, SupabaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
