import {
  Chain,
  quantityToNumber,
  numberToQuantity,
  RpcBlockResponse,
  Hash,
  Address,
  RpcTransactionResponse,
} from '@ethereum-ts/chain'
import { utils } from 'ethers'

export interface BlockListItem {
  hash: Hash,
  number: number,
  transactionCount: number,
}

export interface TransactionListItem {
  blockHash: Hash,
  blockNumber: number,
  hash: Hash,
  from: Address,
  to: Address,
  value: utils.BigNumber,
}

export class Explorer {
  constructor (private chain: Chain) {
  }

  async getLatestBlocks (limit: number) {
    const latest = await this.chain.getBlockNumber()
    const number = quantityToNumber(latest)
    const blocks: BlockListItem[] = []
    for (let i = number; i >= 0 && i > number - limit; i--) {
      const block = await this.chain.getBlock(numberToQuantity(i))
      blocks.push(formatBlock(block))
    }
    return blocks
  }

  async getLatestTransactions (limit: number) {
    const latest = await this.chain.getBlockNumber()
    const number = quantityToNumber(latest)
    const transactions: TransactionListItem[] = []
    for (let i = number; i >= 0 && transactions.length < limit; i--) {
      const block = await this.chain.getBlock(numberToQuantity(i), true)
      const blockTransactions = block.transactions
      while (blockTransactions.length && transactions.length < limit) {
        transactions.push(formatTransaction(blockTransactions.pop()!))
      }
    }
    return transactions
  }
}

function formatBlock (block: RpcBlockResponse): BlockListItem {
  return {
    hash: block.hash,
    number: quantityToNumber(block.number),
    transactionCount: block.transactions.length,
  }
}

const ZERO_ADDRESS = ('0x' + '0'.repeat(64)) as Address

function formatTransaction (transaction: RpcTransactionResponse): TransactionListItem {
  return {
    blockHash: transaction.blockHash!,
    blockNumber: quantityToNumber(transaction.blockNumber!),
    hash: transaction.hash,
    from: transaction.from,
    to: transaction.to ?? ZERO_ADDRESS,
    value: utils.bigNumberify(transaction.value),
  }
}
