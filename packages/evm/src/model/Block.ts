import { ExecutedTransaction } from './ExecutedTransaction'
import { Account } from './Account'
import { Bytes20, Bytes32, Bytes } from './utils'

export interface Block {
  parent?: Block,
  accounts: Map<Bytes20, Account>,
  transactions: ExecutedTransaction[],
  parameters: BlockParameters,
}

export interface BlockParameters {
  hash: Bytes32,
  number: number,
  timestamp: number,
  gasLimit: number,
  gasUsed: number,
  extraData: Bytes,
  miner: Bytes20,
}
