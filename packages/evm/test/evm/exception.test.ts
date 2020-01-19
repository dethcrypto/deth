import { expect } from 'chai'
import { executeAssembly, DEFAULT_EXECUTION_PARAMS } from './helpers'
import { InvalidOpcode } from '../../src/evm/errors'

describe('When an exception occurs', () => {
  it('all gas is used', () => {
    const result = executeAssembly('INVALID')
    expect(result.error).to.be.instanceOf(InvalidOpcode)
    expect(result.gasUsed).to.equal(DEFAULT_EXECUTION_PARAMS.gasLimit)
  })

  xit('state changes are reverted')
})
