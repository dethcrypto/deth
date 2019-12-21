import { Block, PendingTransaction, BlockParameters } from './model'
import { executeTransactions } from './executeTransactions'

export function createBlock (
  parent: Block,
  transactions: PendingTransaction[],
  parameters: BlockParameters,
): Block {
  const block = {
    parent,
    accounts: parent.accounts,
    parameters,
    transactions: [],
  }
  return executeTransactions(block, transactions)
}
