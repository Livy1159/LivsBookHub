import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for frontend connection
  // In production, set FRONTEND_URL to your Vercel domain (e.g., https://your-app.vercel.app)
  // For multiple origins, separate with commas: https://app1.vercel.app,https://app2.vercel.app
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  const allowedOrigins = frontendUrl.includes(',') 
    ? frontendUrl.split(',').map(url => url.trim())
    : frontendUrl;
  
  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });

  // Enable validation pipes globally
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🚀 Backend server running on: http://localhost:${port}`);
}

bootstrap();

