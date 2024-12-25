import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DocumentModule } from './document/document.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { JobsModule } from './jobs/jobs.module';
import { TelegramService } from './telegram/telegram.service';
import { TelegramModule } from './telegram/telegram.module';
import { Web3Module } from './web3/web3.module';
import { Transaction } from './web3/entities/web3';
import { Project } from './project/entities/project.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User, Transaction, Project],
      synchronize: process.env.NODE_ENV !== 'production' ? true : false,
    }),
    ScheduleModule.forRoot(),
    DocumentModule,
    UserModule,
    JobsModule,
    TelegramModule,
    Web3Module,
  ],
  controllers: [AppController],
  providers: [AppService, TelegramService],
})
export class AppModule {}
