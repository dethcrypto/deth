import { Block, PendingTransaction } from './model'
import { execute } from './execute'

export interface BlockParameters {
  parent: Block,
  transactions: PendingTransaction[],
  gasLimit: number,
}

export function createBlock (params: BlockParameters): Block {
  const { accounts, transactions } = execute(params)
  return {
    parent: params.parent,
    transactions,
    accounts,
  }
}
