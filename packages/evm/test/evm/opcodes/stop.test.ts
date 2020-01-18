import { expect } from 'chai'
import { GasCost } from '../../../src/evm/opcodes/gasCosts'
import { executeAssembly, Int256 } from '../helpers'

describe('STOP opcode', () => {
  it(`uses ${GasCost.ZERO} gas`, () => {
    const result = executeAssembly('STOP')
    expect(result.error).to.equal(undefined)
    expect(result.gasUsed).to.equal(GasCost.ZERO)
  })

  it('halts execution', () => {
    const result = executeAssembly('PUSH1 00 STOP NEG')
    expect(result.error).to.equal(undefined)
    expect(result.stack.pop().toHexString()).to.equal(Int256.of(0))
  })
})
