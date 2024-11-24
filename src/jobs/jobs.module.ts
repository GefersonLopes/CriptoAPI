import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { User } from '../user/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TelegramModule } from 'src/telegram/telegram.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), TelegramModule],
  providers: [JobsService],
  exports: [JobsService],
})
export class JobsModule {}
