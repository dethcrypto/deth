import Block from 'ethereumjs-block'
import {
  Quantity,
  Hash,
  bufferToHash,
  quantityToNumber,
  RpcTransactionResponse,
  RpcTransactionReceipt,
  isHash,
  FilterRequest,
  RpcLogObject,
} from '../../model'

/**
 * Simple, in memory, copyable blockchain
 */
export class DethBlockchain {
  constructor (
    private readonly blocks: Block[] = [],
    private readonly transactions: Map<Hash, RpcTransactionResponse> = new Map(),
    private readonly receipts: Map<Hash, RpcTransactionReceipt> = new Map(),
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

  getTransaction (hash: Hash) {
    return this.transactions.get(hash)
  }

  getTransactionReceipt (hash: Hash) {
    return this.receipts.get(hash)
  }

  async getLogs (_filter: FilterRequest): Promise<RpcLogObject[]> {
    throw new Error('not implemented yet')
    // let blocks: RpcBlockResponse[] = [];
    // if (isByBlockRequest(filter)) {
    //   blocks.push(await this.vm.getBlock(filter.blockHash!));
    // } else {
    //   blocks.push(...await this.vm.getBlockByRange(filter.fromBlock, filter.toBlock));
    // }

    // const txs = await this.vm.getAllTxs(filter)
    // filter by address
    // filter by topics
  }

  copy () {
    return new DethBlockchain([...this.blocks], new Map(this.transactions), new Map(this.receipts))
  }
}
