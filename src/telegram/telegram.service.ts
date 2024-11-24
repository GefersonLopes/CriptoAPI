import { Injectable } from '@nestjs/common';
import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';
import input from 'input';

@Injectable()
export class TelegramService {
  private client: TelegramClient;
  private stringSession: StringSession;

  private readonly apiId = +process.env.TELEGRAM_API_ID;
  private readonly apiHash = process.env.TELEGRAM_API_HASH;

  constructor() {
    const savedSession = process.env.TELEGRAM_API_SESSION || '';
    this.stringSession = new StringSession(savedSession);
    this.client = new TelegramClient(
      this.stringSession,
      this.apiId,
      this.apiHash,
      {
        connectionRetries: 5,
      },
    );
  }

  async start() {
    console.log('Iniciando o cliente Telegram...');
    await this.client.start({
      phoneNumber: async () => process.env.TELEGRAM_PHONE_NUMBER,
      password: async () =>
        await input.text('Insira sua senha de 2FA do Telegraam (se houver): '),
      phoneCode: async () =>
        await input.text('Insira o código recebido no seu telefone: '),
      onError: (err) => console.log(err),
    });
    console.log(`Copie essa sessão, meu xapa: ${this.client.session.save()}`);
  }

  async getGroupMembers(
    groupId: string,
    pageSize: number = 10,
  ): Promise<any[]> {
    try {
      if (!this.client.connected) {
        await this.start();
      }

      const chat = await this.client.getEntity(groupId);
      const members = [];
      let offset = 0;

      while (true) {
        const chunk = await this.client.getParticipants(chat, {
          limit: pageSize,
          offset,
        });

        members.push(...chunk);
        offset += chunk.length;

        if (chunk.length < pageSize) {
          break;
        }
      }

      return members;
    } catch (error) {
      console.error('Erro ao obter membros do grupo:', error);
      throw error;
    }
  }
}
