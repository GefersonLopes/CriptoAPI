import { Module } from '@nestjs/common';
import { Web3Service } from './web3.service';
import { Web3Controller } from './web3.controller';
import Web3 from 'web3';

@Module({
  controllers: [Web3Controller],
  providers: [
    {
      provide: 'WEB3',
      useFactory: () => {
        const provider = new Web3.providers.HttpProvider(
          'http://127.0.0.1:8545',
        ); // Ganache ou outra rede
        return new Web3(provider);
      },
    },
    Web3Service,
  ],
  exports: ['WEB3'], // Certifique-se de exportar o token
})
export class Web3Module {}
