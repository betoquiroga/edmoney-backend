import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import { setupSwagger } from './swagger/config.swagger';

// Load environment variables before app initialization
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Configure CORS to only allow specific origins
  app.enableCors({
    origin: ['https://edmoney-frontend.vercel.app', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Setup Swagger documentation
  setupSwagger(app);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application running on port ${port}`);
  console.log(
    `Swagger documentation available at http://localhost:${port}/api/docs`,
  );
}
bootstrap();
