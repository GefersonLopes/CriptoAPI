import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Transaction } from 'src/web3/entities/web3'; // Assumindo que você já criou a entidade Transaction

@Entity('projects') // Nome da tabela no banco de dados
export class Project {
  @PrimaryGeneratedColumn()
  id: number; // ID único do projeto

  @Column({ type: 'varchar', length: 255, nullable: true })
  title: string; // Título do projeto

  @Column({ type: 'varchar', length: 255, nullable: true })
  subtitle: string; // Subtítulo do projeto

  @Column({ type: 'varchar', length: 255, nullable: true })
  logo: string; // URL do logo do projeto

  @Column({ type: 'text', nullable: true })
  description: string; // Descrição do projeto

  @Column({ type: 'varchar', length: 255, nullable: true })
  banner: string; // URL do banner do projeto

  @Column({ type: 'bool', default: false })
  is_standout: boolean; // Indica se o projeto é destaque

  @Column({ type: 'numeric', precision: 8, scale: 2, nullable: true })
  price: number; // Preço do projeto (com precisão)

  @Column({ type: 'varchar', length: 255, nullable: true })
  delivery_type: string; // Tipo de entrega do projeto

  @Column({ type: 'float4', nullable: true })
  marketCap: number; // MarketCap do projeto

  @Column({ type: 'float4', nullable: true })
  maximumSupply: number; // Supply máximo

  @Column({ type: 'float4', nullable: true })
  currentSupply: number; // Supply atual

  @Column({ type: 'date', nullable: true })
  scheduledRelease: Date; // Data de lançamento agendado

  @Column({ type: 'int', nullable: true })
  cliff: number; // Período de cliff

  @Column({ type: 'int', nullable: true })
  vestingReceipt: number; // Vesting Receipt

  @Column({ type: 'varchar', length: 255, nullable: true })
  vestingFrequency: string; // Frequência de vesting

  @Column({ type: 'text', nullable: true })
  fundraising: string; // Detalhes do fundraising

  @Column({ type: 'float4', nullable: true })
  fdv: number; // Fully Diluted Valuation (FDV)

  @OneToMany(() => Transaction, (transaction) => transaction.project)
  transactions: Transaction[]; // Relacionamento com as transações relacionadas ao projeto
}
