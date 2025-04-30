import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import { Plan } from '../plans/entities/plan.entity';
import { Subscription } from '../subscriptions/entities/subscription.entity';
import { Category } from '../categories/entities/category.entity';
import { PaymentMethod } from '../payment-methods/entities/payment-method.entity';
import { InputMethod } from '../input-methods/entities/input-method.entity';
import { Transaction } from '../transactions/entities/transaction.entity';
import { Account } from '../accounts/entities/account.entity';

export const createSwaggerConfig = () => {
  return new DocumentBuilder()
    .setTitle('EDMoney API')
    .setDescription('API for EDMoney application')
    .setVersion('1.0')
    .addTag('auth')
    .addTag('users')
    .addTag('plans')
    .addTag('subscriptions')
    .addTag('categories')
    .addTag('payment-methods')
    .addTag('input-methods')
    .addTag('accounts')
    .addTag('transactions')
    .addBearerAuth()
    .build();
};

export const createSwaggerDocument = (app: INestApplication) => {
  const config = createSwaggerConfig();
  return SwaggerModule.createDocument(app, config, {
    extraModels: [
      Plan,
      Subscription,
      Category,
      PaymentMethod,
      InputMethod,
      Transaction,
      Account,
    ],
  });
};

export const setupSwagger = (app: INestApplication) => {
  const document = createSwaggerDocument(app);
  SwaggerModule.setup('api/docs', app, document);
};
