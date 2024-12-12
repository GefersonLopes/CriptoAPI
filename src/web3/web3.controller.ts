import { Controller, Post, Body } from '@nestjs/common';
import { Web3Service } from './web3.service';

@Controller('web3')
export class Web3Controller {
  constructor(private readonly web3Service: Web3Service) {}

  @Post('send-transaction')
  async sendTransaction(@Body() body: { privateKey: string; value: string }) {
    const to = process.env.PRIVATE_KEY_METAMASK_RECEIVING_PAYMENT;

    if (!to) {
      throw new Error('PRIVATE_KEY_METAMASK_RECEIVING_PAYMENT not found');
    }

    const { privateKey, value } = body;
    const receipt = await this.web3Service.sendTransaction(
      privateKey,
      to,
      value,
    );

    const serializedReceipt = JSON.parse(
      JSON.stringify(receipt, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value,
      ),
    );

    return serializedReceipt;
  }
}
