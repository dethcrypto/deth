import { Bytes20, Log, Block, PendingTransaction } from './model'
import { ExecutionError } from './model/ExecutionError'

export interface TransactionExecutionResult {
  gasUsed: number,
  contractAddress: Bytes20 | null,
  logs: Log[],
  error: ExecutionError | null,
}

/**
 * Alter block state and return transaction execution results
 * @param block a block to execute the transaction on
 * @param transaction a transaction to execute
 */
export function executeTransaction (
  block: Block,
  transaction: PendingTransaction,
): TransactionExecutionResult {
  // TODO: real implementation
  return {
    gasUsed: 21_000,
    contractAddress: null,
    logs: [],
    error: null,
  }
}
