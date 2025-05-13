import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strips data not in dto
      forbidNonWhitelisted: true, // Throws errors if extra data is sent
      transform: true, // Automatically transforms payload data into dtos
    }),
  );
  app.enableCors(); // Enables CORS for Frontend access
  await app.listen(process.env.PORT ?? 3001); // Using port 3001 since React uses 3000/5173 as default
}
bootstrap();
