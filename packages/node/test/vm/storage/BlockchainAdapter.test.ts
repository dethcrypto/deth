import { expect } from 'chai'
import { BN } from 'ethereumjs-util'

import { DethBlockchain } from '../../../src/vm/storage/DethBlockchain'
import { BlockchainAdapter } from '../../../src/vm/storage/BlockchainAdapter'
import { dummyBlock } from './utils'

describe('BlockchainAdapter legacy interface', () => {
  let blockchain: DethBlockchain
  let legacyBlockchain: BlockchainAdapter

  const firstBlock = dummyBlock(0)
  const secondBlock = dummyBlock(1)

  beforeEach(() => {
    blockchain = new DethBlockchain([firstBlock, secondBlock])
    legacyBlockchain = new BlockchainAdapter(blockchain)
  })

  it('works with number', done => {
    legacyBlockchain.getBlock(1, (_err, block) => {
      expect(block).to.be.eq(secondBlock)
      done()
    })
  })

  it('works with BN', done => {
    legacyBlockchain.getBlock(new BN(1), (_err, block) => {
      expect(block).to.be.eq(secondBlock)
      done()
    })
  })

  it('works with Buffer', done => {
    legacyBlockchain.getBlock(secondBlock.hash(), (_err, block) => {
      expect(block).to.be.eq(secondBlock)
      done()
    })
  })
})
