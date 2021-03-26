import Block from 'ethereumjs-block'
import { Quantity, Hash, bufferToHash, quantityToNumber } from '../../model'

/**
 * Simple, in memory, copyable blockchain
 */
export class DethBlockchain {
  constructor(private blocks: Block[] = []) {}

  getBlockByNumber(blockNumber: Quantity) {
    return this.blocks[quantityToNumber(blockNumber)]
  }

  getBlockByHash(hash: Hash) {
    return this.blocks.filter((b) => hash === bufferToHash(b.hash()))[0]
  }

  putBlock(block: Block): Block {
    this.blocks.push(block)

    return block
  }

  putGenesis(block: Block): Block {
    if (this.blocks.length !== 0) {
      throw new Error(
        `Trying to put a genesis block on not empty chain! Chain has ${this.blocks.length} blocks already`
      )
    }

    this.blocks.push(block)

    return block
  }

  getLatestBlock(): Block | undefined {
    return this.blocks[this.blocks.length - 1]
  }

  copy() {
    return new DethBlockchain([...this.blocks])
  }
}
