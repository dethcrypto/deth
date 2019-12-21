import { Bytes20, Account, Bytes32, ExecutedTransaction, Block, PendingTransaction } from './model'

export interface ExecuteParameters {
  parent: Block,
  transactions: PendingTransaction[],
}

export interface BlockExecutionResults {
  accounts: Map<Bytes20, Account>,
  transactions: Map<Bytes32, ExecutedTransaction>,
}

export function execute (params: ExecuteParameters): BlockExecutionResults {
  throw new Error('Not implemented')
}
