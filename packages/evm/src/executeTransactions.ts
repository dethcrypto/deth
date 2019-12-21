import { Block, PendingTransaction } from './model'
import { cloneBlock } from './cloneBlock'

export function executeTransactions (
  block: Block,
  transactions: PendingTransaction[],
): Block {
  return transactions.reduce(executeTransaction, block)
}

function executeTransaction (
  block: Block,
  transaction: PendingTransaction,
): Block {
  const cloned = cloneBlock(block)
  return cloned
}
