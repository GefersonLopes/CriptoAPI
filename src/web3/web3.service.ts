import { Inject, Injectable } from '@nestjs/common';
import Web3 from 'web3';

@Injectable()
export class Web3Service {
  private readonly web3: Web3;

  constructor(@Inject('WEB3') web3: Web3) {
    this.web3 = web3;
  }

  async sendTransaction(privateKey: string, to: string, valueInEther: string) {
    const value = this.web3.utils.toWei(valueInEther, 'ether');

    const account = this.web3.eth.accounts.privateKeyToAccount(privateKey);

    const gas = await this.web3.eth.estimateGas({
      from: account.address,
      to,
      value,
    });

    const gasPrice = await this.web3.eth.getGasPrice();

    const transaction = {
      from: account.address,
      to,
      value,
      gas,
      gasPrice,
    };

    const signedTransaction = await this.web3.eth.accounts.signTransaction(
      transaction,
      privateKey,
    );

    const receipt = await this.web3.eth.sendSignedTransaction(
      signedTransaction.rawTransaction || '',
    );

    return receipt;
  }

  async convertUsdToEth(usdAmount: number): Promise<string> {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd',
    );
    const data = await response.json();

    const ethPriceInUsd = data.ethereum.usd;
    const ethValue = usdAmount / ethPriceInUsd;

    return ethValue.toString();
  }
}
