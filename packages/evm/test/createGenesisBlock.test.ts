import { expect } from 'chai'
import { createGenesisBlock } from '../src/createGenesisBlock'

describe('createGenesisBlock', () => {
  it('creates an empty block', () => {
    const block = createGenesisBlock({
      balances: new Map(),
    })

    expect(block).to.deep.equal({
      parent: undefined,
      accounts: new Map(),
      transactions: new Map(),
    })
  })
})
