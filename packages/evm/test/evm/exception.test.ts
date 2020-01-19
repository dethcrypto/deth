import { expect } from 'chai'
import { executeAssembly } from './helpers'
import { InvalidOpcode } from '../../src/evm/errors'

describe('When an exception occurs', () => {
  it('all gas is used', () => {
    const result = executeAssembly('INVALID', { gasLimit: 1_000_000 })
    expect(result.error).to.be.instanceOf(InvalidOpcode)
    expect(result.gasUsed).to.equal(1_000_000)
  })

  xit('state changes are reverted')
})
