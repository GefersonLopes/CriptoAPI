import { Project } from 'src/project/entities/project.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'json', nullable: true })
  accessList: any;

  @Column({ nullable: true })
  blockHash: string | null;

  @Column({ nullable: true })
  blockNumber: number | null;

  @Column({ nullable: false, default: 0 })
  chainId: number;

  @Column({ nullable: true, default: 0 })
  confirmations: number;

  @Column({ nullable: true })
  creates: string | null;

  @Column({ type: 'text', nullable: false })
  data: string;

  @Column({ nullable: false })
  from: string;

  @Column({ type: 'varchar', nullable: false })
  gasLimit: string;

  @Column({ type: 'varchar', nullable: false })
  gasPrice: string;

  @Column({ nullable: false })
  hash: string;

  @Column({ type: 'varchar', nullable: true })
  maxFeePerGas: string | null;

  @Column({ type: 'varchar', nullable: true })
  maxPriorityFeePerGas: string | null;

  @Column({ nullable: false })
  nonce: number;

  @Column({ nullable: true })
  r: string | null;

  @Column({ nullable: true })
  s: string | null;

  @Column({ nullable: true })
  to: string | null;

  @Column({ nullable: true })
  transactionIndex: number | null;

  @Column({ nullable: false, default: 2 })
  type: number;

  @Column({ type: 'numeric', precision: 20, scale: 2, nullable: false })
  qtt: number;

  @Column({ type: 'bigint', nullable: false })
  valueUSD: number;

  @Column({ type: 'bigint', nullable: false })
  totalValue: number;

  @Column({ type: 'varchar', nullable: false })
  v: string;

  @Column({ type: 'varchar', nullable: false })
  value: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ManyToOne(() => Project, (project) => project.transactions, {
    nullable: true,
  })
  project: Project;

  @ManyToOne(() => User, (user) => user.transactions, {
    nullable: true,
  })
  userAccount: User;
}
