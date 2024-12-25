import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ITransaction } from 'src/interfaces/transaction';
import { Repository } from 'typeorm';
import { Transaction } from './entities/web3';
import { Project } from 'src/project/entities/project.entity';
import { User } from 'src/user/entities/user.entity';
// import Web3 from 'web3';

@Injectable()
export class Web3Service {
  // private readonly web3: Web3;

  // constructor(@Inject('WEB3') web3: Web3) {
  //   this.web3 = web3;
  // }

  // async sendTransaction(privateKey: string, to: string, valueInEther: string) {
  //   const value = this.web3.utils.toWei(valueInEther, 'ether');

  //   const account = this.web3.eth.accounts.privateKeyToAccount(privateKey);

  //   const gas = await this.web3.eth.estimateGas({
  //     from: account.address,
  //     to,
  //     value,
  //   });

  //   const gasPrice = await this.web3.eth.getGasPrice();

  //   const transaction = {
  //     from: account.address,
  //     to,
  //     value,
  //     gas,
  //     gasPrice,
  //   };

  //   const signedTransaction = await this.web3.eth.accounts.signTransaction(
  //     transaction,
  //     privateKey,
  //   );

  //   const receipt = await this.web3.eth.sendSignedTransaction(
  //     signedTransaction.rawTransaction || '',
  //   );

  //   return receipt;
  // }

  // async convertUsdToEth(usdAmount: number): Promise<string> {
  //   const response = await fetch(
  //     'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd',
  //   );
  //   const data = await response.json();

  //   const ethPriceInUsd = data.ethereum.usd;
  //   const ethValue = usdAmount / ethPriceInUsd;

  //   return ethValue.toString();
  // }

  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async saveTransaction(transaction: ITransaction) {
    const project = await this.projectRepository.findOne({
      where: { id: transaction.projectId },
    });
    if (!project) {
      throw new Error('Project not found');
    }

    const newDataTransaction = {
      ...transaction,
      qtt: transaction.valueUSD / project.price,
      totalValue: parseFloat((transaction.valueUSD * 1.2).toFixed(2)),
    };

    const user = await this.userRepository.findOne({
      where: { key_user: transaction.userAccount },
    });
    if (!user) {
      throw new Error('User not found');
    }

    const transactionEntity = this.transactionRepository.create({
      ...newDataTransaction,
      project,
      userAccount: user,
    });

    return this.transactionRepository.save(transactionEntity);
  }

  async getTransactions(key_user: string) {
    const user = await this.userRepository.findOne({
      where: { key_user },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return this.transactionRepository.find({
      relations: ['project', 'userAccount'],
      order: { createdAt: 'DESC' },
      where: { userAccount: { id: user.id } },
    });
  }

  async getTransactionsByProject({
    userAccount,
    projectId,
  }: {
    userAccount: string;
    projectId: number;
  }) {
    const user = await this.userRepository.findOne({
      where: { key_user: userAccount },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return this.transactionRepository.find({
      relations: ['project', 'userAccount'],
      order: { createdAt: 'DESC' },
      where: { userAccount: { id: user.id }, project: { id: projectId } },
    });
  }
}
