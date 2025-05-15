import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, INestApplication } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';

// Common function to apply global configurations (Pipes, CORS)
function applyGlobalConfig(app: INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.enableCors();
}

// --- Local Development Startup ---
async function bootstrapLocal() {
  const app = await NestFactory.create(AppModule); // Create app normally
  applyGlobalConfig(app); // Apply common configurations
  const port = process.env.PORT ?? 3001; // Use environment variable or default
  await app.listen(port); // Start listening for local requests
  console.log(`Application is running on: ${await app.getUrl()}`);
}

// --- Vercel Serverless Handler ---
// We need an Express instance and caching for the serverless function
const expressServer = require('express')();
let cachedNestApp: INestApplication; // Cache for warm starts

async function bootstrapVercel() {
  if (!cachedNestApp) {
    // Create app using ExpressAdapter for Vercel
    const app = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressServer),
    );
    applyGlobalConfig(app); // Apply common configurations
    await app.init(); // Initialize the app for serverless execution
    cachedNestApp = app; // Cache the initialized app
  }
  return cachedNestApp.getHttpAdapter().getInstance(); // Return the underlying Express instance
}

// --- Conditional Execution ---
if (process.env.NODE_ENV === 'production') {
  // In production (Vercel), export the serverless handler
  module.exports = async (req, res) => {
    const server = await bootstrapVercel();
    server(req, res);
  };
} else {
  // In development, run the local bootstrap function
  bootstrapLocal();
}
