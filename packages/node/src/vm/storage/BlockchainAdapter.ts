import { callbackify } from 'util'
import { BN } from 'ethereumjs-util'

import { DethBlockchain } from './DethBlockchain'
import { bnToQuantity, numberToQuantity, bufferToHash } from '../../primitives'
import { callbackifySync } from './adapter-utils'

/**
 * Wraps DethBlockchain into ethereum-js/blockchain compatible interface
 */
export class BlockchainAdapter {
  constructor (public readonly dethBlockchain: DethBlockchain) {}
  putGenesis = callbackifySync(this.dethBlockchain.putGenesis.bind(this.dethBlockchain))

  getLatestBlock = callbackifySync(this.dethBlockchain.getLatestBlock.bind(this.dethBlockchain))

  getBlock = callbackify(async (numberOrTag: Buffer | number | BN) => {
    if (numberOrTag instanceof Buffer) {
      return this.dethBlockchain.getBlockByHash(bufferToHash(numberOrTag))
    }
    if (numberOrTag instanceof BN) {
      return this.dethBlockchain.getBlockByNumber(bnToQuantity(numberOrTag))
    }
    return this.dethBlockchain.getBlockByNumber(numberToQuantity(numberOrTag))
  })

  // @todo isGenesis arg is missing
  putBlock = callbackifySync(this.dethBlockchain.putBlock.bind(this.dethBlockchain))
}
