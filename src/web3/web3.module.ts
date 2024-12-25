import { Module } from '@nestjs/common';
// import { Web3Service } from './web3.service';
import { Web3Controller } from './web3.controller';
// import Web3 from 'web3';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/web3';
import { Project } from 'src/project/entities/project.entity';
import { Web3Service } from './web3.service';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, Project, User])],
  controllers: [Web3Controller],
  providers: [Web3Service],
  exports: [Web3Service],
  // providers: [
  //   {
  //     provide: 'WEB3',
  //     useFactory: () => {
  //       const provider = new Web3.providers.HttpProvider(
  //         'http://127.0.0.1:8545',
  //       );
  //       return new Web3(provider);
  //     },
  //   },
  //   Web3Service,
  // ],
  // exports: ['WEB3'],
})
export class Web3Module {}
