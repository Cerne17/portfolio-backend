import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsModule } from './posts/posts.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      // For PostgreSQL, you'd add host, port, username, password:
      // host: process.env.DB_HOST || 'localhost',
      // port: parseInt(process.env.DB_PORT, 10) || 5432,
      // username: process.env.DB_USERNAME || 'youruser',
      // password: process.env.DB_PASSWORD || 'yourpassword',
      // database: process.env.DB_NAME || 'portfolio_db'
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Do not use in production
    }),
    PostsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
