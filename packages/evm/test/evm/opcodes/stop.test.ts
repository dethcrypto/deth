import { expect } from 'chai'
import { executeAssembly } from '../executeAssembly'
import { GasCost } from '../../../src/evm/opcodes/gasCosts'

describe('STOP opcode', () => {
  it(`uses ${GasCost.ZERO} gas`, () => {
    const result = executeAssembly('STOP')
    expect(result.gasUsed).to.equal(GasCost.ZERO)
  })

  it('halts execution', () => {
    const result = executeAssembly('PUSH1 00 STOP NEG')
    expect(result.stack.pop().toHexString()).to.equal('0'.repeat(64))
  })
})
