import { expect } from 'chai'
import { cloneBlock } from '../src/cloneBlock'
import { Block, Account } from '../src/model'

describe('cloneBlock', () => {
  it('correctly clones a block', () => {
    const account: Account = {
      balance: '10',
      code: '0x123',
      nonce: 42,
      storage: new Map([
        ['1', '2'],
        ['3', '4'],
      ]),
    }
    const block: Block = {
      accounts: new Map([
        ['123', account],
      ]),
      parameters: {
        gasLimit: 1000,
      } as any,
      transactions: [],
    }
    block.parent = block

    const clone = cloneBlock(block)

    expect(clone).to.deep.equal(block)
    expect(clone.parent).to.equal(block)
    expect(clone.accounts).not.to.equal(block.accounts)
    expect(clone.accounts.get('123')).not.to.equal(block.accounts.get('123'))
    expect(clone.parameters).not.to.equal(block.parameters)
    expect(clone.transactions).not.to.equal(block.transactions)
  })
})
