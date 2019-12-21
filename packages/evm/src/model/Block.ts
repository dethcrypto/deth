import { ExecutedTransaction } from './ExecutedTransaction'
import { Account } from './Account'
import { Bytes20 } from './utils'

export interface Block {
  parent?: Block,
  accounts: Map<Bytes20, Account>,
  transactions: ExecutedTransaction[],
  parameters: BlockParameters,
}

export interface BlockParameters {
  gasLimit: number,
}
