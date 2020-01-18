import { expect } from 'chai'
import { GasCost } from '../../../src/evm/opcodes/gasCosts'
import { executeAssembly } from '../executeAssembly'
import { Int256 } from './machineWord/cases/helpers'
import { expectUnderflow } from './helpers'

describe('POP opcode', () => {
  it(`uses ${GasCost.BASE} gas`, () => {
    const result = executeAssembly('PUSH1 00 POP')
    expect(result.error).to.equal(undefined)
    expect(result.gasUsed - GasCost.VERYLOW).to.equal(GasCost.BASE)
  })

  it('pops an item from the stack', () => {
    const result = executeAssembly('PUSH1 01 PUSH1 02 POP')
    expect(result.error).to.equal(undefined)
    expect(result.stack.pop().toHexString()).to.equal(Int256.of(1))
  })

  it('can cause a stack underflow', () => {
    expectUnderflow('POP', 1)
  })
})
