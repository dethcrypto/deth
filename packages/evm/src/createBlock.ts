import { Block, PendingTransaction, BlockParameters } from './model'
import { includeTransactions } from './includeTransactions'

export function createBlock (
  parent: Block,
  transactions: PendingTransaction[],
  parameters: BlockParameters,
): Block {
  const block = {
    parent,
    accounts: parent.accounts,
    parameters: { ...parameters },
    transactions: [],
  }
  return includeTransactions(block, transactions)
}
