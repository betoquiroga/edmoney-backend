import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { Plan } from './plans/entities/plan.entity';
import { Subscription } from './subscriptions/entities/subscription.entity';
import { Category } from './categories/entities/category.entity';
import { PaymentMethod } from './payment-methods/entities/payment-method.entity';

// Load environment variables before app initialization
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // Enable CORS for API requests

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('EDMoney API')
    .setDescription('API for EDMoney application')
    .setVersion('1.0')
    .addTag('auth')
    .addTag('users')
    .addTag('plans')
    .addTag('subscriptions')
    .addTag('categories')
    .addTag('payment-methods')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    extraModels: [Plan, Subscription, Category, PaymentMethod],
  });
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application running on port ${port}`);
  console.log(
    `Swagger documentation available at http://localhost:${port}/api/docs`,
  );
}
bootstrap();
