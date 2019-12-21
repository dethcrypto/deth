import { ExecutedTransaction } from './ExecutedTransaction'
import { Account } from './Account'
import { Bytes32, Bytes20 } from './utils'

export interface Block {
  parent?: Block,
  transactions: Map<Bytes32, ExecutedTransaction>,
  accounts: Map<Bytes20, Account>,
}
