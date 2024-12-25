export interface ITransaction {
  accessList: any; // Lista de acessos (EIP-2930), pode ser mais detalhada
  blockHash: string | null; // Hash do bloco ao qual a transação pertence (null se não confirmado)
  blockNumber: number | null; // Número do bloco (null se não confirmado)
  chainId: number; // ID da cadeia (Chain ID)
  confirmations: number; // Número de confirmações da transação
  creates: string | null; // Endereço do contrato criado (se aplicável)
  data: string; // Dados enviados na transação (payload)
  from: string; // Endereço do remetente
  gasLimit: string; // Limite de gás (em hexadecimal ou string)
  gasPrice: string; // Preço do gás (em hexadecimal ou string)
  hash: string; // Hash da transação
  maxFeePerGas: string; // Taxa máxima por gás (em hexadecimal ou string)
  maxPriorityFeePerGas: string; // Taxa máxima prioritária (em hexadecimal ou string)
  nonce: number; // Nonce da transação
  r: string; // Parte 'r' da assinatura
  s: string; // Parte 's' da assinatura
  to: string | null; // Endereço do destinatário (null para criação de contrato)
  transactionIndex: number | null; // Índice da transação no bloco (null se não confirmado)
  type: number; // Tipo da transação (ex.: 2 para EIP-1559)
  projectId: number;
  valueUSD: number;
  v: any; // Valor 'v' da assinatura
  value: string; // Valor da transação em Wei (em hexadecimal ou string)
  project: any;
  userAccount: string;
  totalValue?: number;
  qtt?: number;
  wait: (confirmations?: number) => Promise<TransactionReceipt>; // Função para esperar confirmações
}

export interface TransactionReceipt {
  status: number; // Status da transação (1 = sucesso, 0 = falha)
  transactionHash: string; // Hash da transação
  blockNumber: number; // Número do bloco em que a transação foi confirmada
  confirmations: number; // Número de confirmações da transação
}
