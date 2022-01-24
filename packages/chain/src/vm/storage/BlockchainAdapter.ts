import { BN } from 'ethereumjs-util'

import { DethBlockchain } from './DethBlockchain'
import { bnToQuantity, numberToQuantity, bufferToHash } from '../../model'
import { Block } from '@ethereumjs/block'

/**
 * Wraps DethBlockchain into ethereum-js/blockchain compatible interface
 */
export class BlockchainAdapter {
  constructor(public readonly dethBlockchain: DethBlockchain) {}
  putGenesis(block: Block): Block {
    this.dethBlockchain.putGenesis(block)
  }
  getLatestBlock(): Block {
    return this.dethBlockchain.getLatestBlock()
  }
  putBlock(block: Block): Block {
    return this.dethBlockchain.putBlock(block)
  }

  async getBlock(numberOrTag: Buffer | number | BN): Promise<Block> {
    if (numberOrTag instanceof Buffer) {
      return this.dethBlockchain.getBlockByHash(bufferToHash(numberOrTag))
    }
    if (numberOrTag instanceof BN) {
      return this.dethBlockchain.getBlockByNumber(bnToQuantity(numberOrTag))
    }
    return this.dethBlockchain.getBlockByNumber(numberToQuantity(numberOrTag))
  }
}
