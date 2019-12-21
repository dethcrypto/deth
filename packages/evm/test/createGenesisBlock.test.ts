import { expect } from 'chai'
import { createGenesisBlock } from '../src/createGenesisBlock'
import { BlockParameters } from '../src/model'

describe('createGenesisBlock', () => {
  const parameters: BlockParameters = {
    extraData: '0x',
    gasLimit: 1234,
    gasUsed: 123,
    hash: '0x12ab',
    miner: '0x34bc',
    number: 1,
    timestamp: 100000,
  }

  it('creates an empty block', () => {
    const block = createGenesisBlock({
      balances: new Map(),
      parameters,
    })

    expect(block).to.deep.equal({
      parent: undefined,
      accounts: new Map(),
      transactions: [],
      parameters
    })
    expect(block.parameters).not.to.equal(parameters)
  })

  it('creates a block with some accounts', () => {
    const block = createGenesisBlock({
      balances: new Map([
        ['0x1234', '0x4000'],
        ['0x56EF', '0x2137'],
      ]),
      parameters,
    })

    expect(block).to.deep.equal({
      parent: undefined,
      accounts: new Map([
        ['0x1234', {
          balance: '0x4000',
          storage: new Map(),
          nonce: 0,
          code: '0x',
        }],
        ['0x56EF', {
          balance: '0x2137',
          storage: new Map(),
          nonce: 0,
          code: '0x',
        }],
      ]),
      transactions: [],
      parameters
    })
    expect(block.parameters).not.to.equal(parameters)
  })
})
