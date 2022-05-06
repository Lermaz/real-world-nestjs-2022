import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ModelsModule } from './models/models.module';
import { MailModule } from './mail/mail.module';
import { join } from 'path';
import 'dotenv/config';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI, {
      user: process.env.MONGO_USER,
      pass: process.env.MONGO_PASS,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      //exclude: ['/api/app*'],
    }),
    MulterModule.register({
      dest: './files',
    }),
    AuthModule,
    MailModule,
    ModelsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
