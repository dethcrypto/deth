import Block from 'ethereumjs-block'
import {
  Quantity,
  Hash,
  bufferToHash,
  quantityToNumber,
  RpcTransactionResponse,
  RpcTransactionReceipt,
  isHash,
} from '../../model'

/**
 * Simple, in memory, copyable blockchain
 */
export class DethBlockchain {
  constructor (
    public readonly blocks: Block[] = [],
    public readonly transactions: Map<Hash, RpcTransactionResponse> = new Map(),
    public readonly receipts: Map<Hash, RpcTransactionReceipt> = new Map(),
  ) {}

  addReceipts (receipts: RpcTransactionReceipt[]): void {
    for (const receipt of receipts) {
      this.receipts.set(receipt.transactionHash, receipt)
    }
  }

  addTransactions (txs: RpcTransactionResponse[]): void {
    for (const tx of txs) {
      this.transactions.set(tx.hash, tx)
    }
  }

  getBlock (hashOrQuantity: Quantity | Hash): Block {
    if (isHash(hashOrQuantity)) {
      return this.getBlockByHash(hashOrQuantity)
    } else {
      return this.getBlockByNumber(hashOrQuantity)
    }
  }

  getBlockByNumber (blockNumber: Quantity) {
    return this.blocks[quantityToNumber(blockNumber)]
  }

  getBlockByHash (hash: Hash) {
    return this.blocks.filter(b => hash === bufferToHash(b.hash()))[0]
  }

  putBlock (block: Block): Block {
    this.blocks.push(block)

    return block
  }

  putGenesis (block: Block): Block {
    if (this.blocks.length !== 0) {
      throw new Error(
        `Trying to put a genesis block on not empty chain! Chain has ${this.blocks.length} blocks already`,
      )
    }

    this.blocks.push(block)

    return block
  }

  getLatestBlock (): Block | undefined {
    return this.blocks[this.blocks.length - 1]
  }

  getBlockNumber (): number {
    return this.blocks.length
  }

  getTransaction (hash: Hash) {
    return this.transactions.get(hash)
  }

  getTransactionReceipt (hash: Hash) {
    return this.receipts.get(hash)
  }

  copy () {
    return new DethBlockchain([...this.blocks], new Map(this.transactions), new Map(this.receipts))
  }
}

// extract BlockchainRepository with all methods using OUR interface already
// it should have reference to blockchain?
