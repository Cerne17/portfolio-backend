import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsModule } from './posts/posts.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: process.env.NODE_ENV === 'production',
      envFilePath: '.env',
    }),
    // TypeOrmModule.forRootAsync({
    // imports: [ConfigModule], // Import ConfigModule here as well
    // inject: [ConfigService], // Inject ConfigService
    // useFactory: (configService: ConfigService) => ({
    //   type: 'postgres',
    //   host: configService.get<string>('DB_HOST'),
    //   port: parseInt(configService.get<string>('DB_PORT', '5432'), 10),
    //   username: configService.get<string>('DB_USERNAME'),
    //   password: configService.get<string>('DB_PASSWORD'),
    //   database: configService.get<string>('DB_NAME'),
    //   entities: [__dirname + '/**/*.entity{.ts,.js}'], // Or use autoLoadEntities: true
    //   // autoLoadEntities: true, // Simpler than specifying entities path
    //   synchronize: configService.get<string>('NODE_ENV') !== 'production', // true for dev, false for prod
    //   ssl:
    //     configService.get<string>('NODE_ENV') === 'production'
    //       ? { rejectUnauthorized: false } // Necessary for many hosted DBs including Supabase default
    //       : false,
    // }),
    // }),
    TypeOrmModule.forRoot({
      type: (process.env.DB_TYPE as any) || 'postgres',
      host:
        process.env.DB_HOST === 'production'
          ? 'db.vjikgrjmjqslaapypswv.supabase.co'
          : process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT as string, 10) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'postgres',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: process.env.NODE_ENV !== 'production',
      ssl:
        process.env.NODE_ENV === 'production'
          ? { rejectUnauthorized: false }
          : false,
    }),
    PostsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
