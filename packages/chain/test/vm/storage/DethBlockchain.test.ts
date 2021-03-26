import { DethBlockchain } from '../../../src/vm/storage/DethBlockchain'
import { dummyBlock } from './utils'
import { expect } from 'chai'
import { bufferToHash, numberToQuantity } from '../../../src/model'

describe('DethBlockchain', () => {
  it('puts blocks', () => {
    const blockchain = new DethBlockchain()
    const firstBlock = dummyBlock(1)
    blockchain.putBlock(firstBlock)

    expect(blockchain.getBlockByNumber(numberToQuantity(0))).to.eq(firstBlock)
  })

  it('gets existing blocks by hash', () => {
    const blockchain = new DethBlockchain()

    const firstBlock = dummyBlock(1)
    const secondBlock = dummyBlock(2)

    blockchain.putBlock(firstBlock)
    blockchain.putBlock(secondBlock)

    expect(blockchain.getBlockByHash(bufferToHash(secondBlock.hash()))).to.eq(
      secondBlock
    )
  })

  it('gets not existing blocks by hash', () => {
    const blockchain = new DethBlockchain()

    const firstBlock = dummyBlock(1)
    const secondBlock = dummyBlock(2)
    const thirdBlock = dummyBlock(3)

    blockchain.putBlock(firstBlock)
    blockchain.putBlock(secondBlock)

    expect(blockchain.getBlockByHash(bufferToHash(thirdBlock.hash()))).to.eq(
      undefined
    )
  })

  it('gets latest block', () => {
    const blockchain = new DethBlockchain()

    const firstBlock = dummyBlock(1)
    const secondBlock = dummyBlock(2)

    blockchain.putBlock(firstBlock)
    blockchain.putBlock(secondBlock)

    expect(blockchain.getLatestBlock()).to.eq(secondBlock)
  })

  it('deep copies', () => {
    const baseBlockchain = new DethBlockchain()
    const firstBlock = dummyBlock(1)
    baseBlockchain.putBlock(firstBlock)

    const longerBlockchain = baseBlockchain.copy()
    const secondBlock = dummyBlock(2)
    longerBlockchain.putBlock(secondBlock)

    expect(baseBlockchain.getLatestBlock()).to.eq(firstBlock)
    expect(longerBlockchain.getLatestBlock()).to.eq(secondBlock)
  })
})
