import { Block, PendingTransaction } from './model'
import { cloneBlock } from './cloneBlock'
import { executeTransaction } from './executeTransaction'

export function includeTransactions (
  block: Block,
  transactions: PendingTransaction[],
): Block {
  return transactions.reduce(includeTransaction, block)
}

function includeTransaction (
  block: Block,
  transaction: PendingTransaction,
): Block {
  const cloned = cloneBlock(block)

  const result = executeTransaction(cloned, transaction)

  if (!result.error) {
    cloned.parameters.gasUsed += result.gasUsed
    cloned.transactions.push({
      from: transaction.from,
      to: transaction.to,
      hash: transaction.hash,
      contractAddress: result.contractAddress,
      logs: result.logs,
      gasUsed: result.gasUsed,
      cumulativeGasUsed: cloned.parameters.gasUsed,
      error: null,
    })

    return cloned
  } else {
    const reverted = cloneBlock(block)

    reverted.parameters.gasUsed += result.gasUsed
    reverted.transactions.push({
      from: transaction.from,
      to: transaction.to,
      hash: transaction.hash,
      contractAddress: null,
      logs: [],
      gasUsed: result.gasUsed,
      cumulativeGasUsed: reverted.parameters.gasUsed,
      error: result.error,
    })

    return reverted
  }
}
