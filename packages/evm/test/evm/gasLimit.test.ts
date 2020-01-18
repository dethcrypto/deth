import { expect } from 'chai'
import { executeAssembly } from './helpers'
import { OutOfGas } from '../../src/evm/errors'

describe('gasLimit', () => {
  it('fails with OutOfGas when reached', () => {
    const result = executeAssembly('JUMPDEST PUSH1 00 JUMP')
    expect(result.error).to.be.instanceOf(OutOfGas)
  })
})
