import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository, Not, IsNull } from 'typeorm';

import { TelegramService } from 'src/telegram/telegram.service';

@Injectable()
export class JobsService {
  private readonly logger = new Logger(JobsService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly telegramService: TelegramService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async updateTypeUserByTelegram() {
    const pageSize = 10;
    let page = 0;
    let users;

    do {
      users = await this.getUsers(page, pageSize);

      await Promise.allSettled(
        users.map((user: User) => this.processUser(user)),
      );

      page++;
    } while (users.length === pageSize);
  }

  async getUsers(page: number, pageSize: number): Promise<User[]> {
    return this.userRepository.find({
      where: { telegram: Not(IsNull()) },
      skip: page * pageSize,
      take: pageSize,
    });
  }

  async processUser(user: User): Promise<void> {
    try {
      const allMembersInGroup = await this.telegramService.getGroupMembers(
        process.env.TELEGRAM_GROUP_ID,
      );

      const isUserInGroup = allMembersInGroup.some((member) =>
        member.phone?.includes(user.telegram),
      );

      if (isUserInGroup) {
        await this.alterTypeUserToMember(user);
      } else {
        await this.alterTypeUserToCommon(user);
      }
    } catch (error) {
      throw error;
    }
  }

  async alterTypeUserToMember(user: User): Promise<void> {
    if (user.user_type !== 'member') {
      user.user_type = 'member';
      await this.userRepository.save(user);
    }
  }

  async alterTypeUserToCommon(user: User): Promise<void> {
    if (user.user_type !== 'common') {
      user.user_type = 'common';
      await this.userRepository.save(user);
    }
  }

  // @Cron('0 0 * * *') // Executa à meia-noite todos os dias
  // runAtMidnight() {
  //   this.logger.log('Cron job executado à meia-noite!');
  //   // Adicione a lógica aqui
  // }
}
