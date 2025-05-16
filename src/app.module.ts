import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { Post } from './posts/post.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: process.env.NODE_ENV === 'production',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // Ensure ConfigModule is available for injection
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        // --- DIAGNOSTIC LOGS ---
        console.log('[AppModule - TypeORM Config] Initializing TypeORM...');
        const databaseUrl = configService.get<string>('DATABASE_URL');

        if (databaseUrl) {
          console.log('[AppModule - TypeORM Config] Using DATABASE_URL.');
          return {
            type: 'postgres',
            url: databaseUrl,
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: false, // NEVER true in production
            logging: process.env.NODE_ENV === 'development',
            ssl: {
              // Often handled by the DATABASE_URL if sslmode=require is in it
              rejectUnauthorized: false, // Usually fine for Supabase
            },
          };
        } else {
          const nodeEnv = configService.get<string>('NODE_ENV');
          const dbHost = configService.get<string>('POSTGRES_HOST');
          const dbPort = configService.get<number>('POSTGRES_PORT');
          const dbUsername = configService.get<string>('POSTGRES_USERNAME');
          // It's generally not a good idea to log passwords, even masked, in production.
          const dbPassword = configService.get<string>('POSTGRES_PASSWORD');
          const dbName = configService.get<string>('POSTGRES_NAME');
          const dbType = configService.get<string>('POSTGRES_TYPE');

          console.log(`[AppModule - TypeORM Config] NODE_ENV: '${nodeEnv}'`);
          console.log(
            `[AppModule - TypeORM Config] POSTGRES_TYPE: '${dbType}'`,
          );
          console.log(
            `[AppModule - TypeORM Config] POSTGRES_HOST: '${dbHost}'`,
          );
          console.log(
            `[AppModule - TypeORM Config] POSTGRES_PORT: '${dbPort}'`,
          );
          console.log(
            `[AppModule - TypeORM Config] POSTGRES_USERNAME: '${dbUsername}'`,
          );
          console.log(
            `[AppModule - TypeORM Config] POSTGRES_PASSWORD: '${dbPassword ? dbPassword.slice(0, 4) : 'NOT SET'}'`,
          );
          console.log(
            `[AppModule - TypeORM Config] POSTGRES_NAME: '${dbName}'`,
          );

          if (!dbHost) {
            console.error(
              '[AppModule - TypeORM Config] CRITICAL: POSTGRES_HOST is undefined or empty. Check Vercel environment variables and ConfigService setup.',
            );
            throw new Error('POSTGRES_HOST environment variable is not set.');
          }

          return {
            type: (dbType as any) || 'postgres', // Default to 'postgres' if not set
            host: dbHost,
            port: dbPort || 5432, // Default to 5432 if not set
            username: dbUsername,
            password: configService.get<string>('POSTGRES_PASSWORD'), // Get password directly here
            database: dbName,
            // For serverless environments, explicitly importing entities is more robust
            entities: [Post],
            // `synchronize: true` should NOT be used in production as it can lead to data loss.
            // Set it to `false` in production.
            synchronize: nodeEnv !== 'production',
            // SSL is required for Supabase and many other cloud PostgreSQL providers.
            ssl:
              nodeEnv === 'production'
                ? { rejectUnauthorized: false } // Common setting for cloud DBs
                : false,
            // Optional: More detailed logging for TypeORM queries in development
            logging: nodeEnv !== 'production' ? true : ['error'],
          };
        }

        // --- END DIAGNOSTIC LOGS ---
      },
    }),
    PostsModule, // Your feature modules
    // Other modules...
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
