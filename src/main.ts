import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { Logger, ValidationPipe } from '@nestjs/common';
import { setupSwagger } from './swagger/config.swagger';

// Load environment variables before app initialization
dotenv.config();

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });
  
  // Configure CORS to allow all origins in development
  const corsOrigins = [
    'https://edmoney-frontend.vercel.app', 
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:8080',
    'http://localhost:4001',
    // En desarrollo, permitir cualquier origen
    ...(process.env.NODE_ENV !== 'production' ? ['*'] : []),
  ];
  
  logger.log(`CORS enabled for origins: ${corsOrigins.join(', ')}`);
  
  app.enableCors({
    origin: corsOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
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

  // Establecer puerto a 4001 para desarrollo
  const port = process.env.PORT || 4001;
  await app.listen(port);
  logger.log(`Application running on port ${port}`);
  logger.log(
    `Swagger documentation available at http://localhost:${port}/api/docs`,
  );
}
bootstrap();
