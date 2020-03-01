import {
  Chain,
  quantityToNumber,
  numberToQuantity,
  RpcBlockResponse,
  Hash,
} from '@deth/chain'

export interface BlockListItem {
  hash: Hash,
  number: number,
  transactionCount: number,
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

  }
}

function formatBlock (block: RpcBlockResponse): BlockListItem {
  return {
    hash: block.hash,
    number: quantityToNumber(block.number),
    transactionCount: block.transactions.length,
  }
}
