import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { User } from '../user/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [TelegramService],
  exports: [TelegramService],
})
export class TelegramModule {}
