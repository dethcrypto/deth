import { GasCost } from '../../../src/evm/opcodes/gasCosts'
import { Int256, expectUnderflow, expectGas, expectStack } from '../helpers'

describe('POP opcode', () => {
  it(`uses ${GasCost.BASE} gas`, () => {
    expectGas('PUSH1 00 POP', GasCost.VERYLOW + GasCost.BASE)
  })

  it('pops an item from the stack', () => {
    expectStack('PUSH1 01 PUSH1 02 POP', [Int256.of(1)])
  })

  it('can cause a stack underflow', () => {
    expectUnderflow('POP', 1)
  })
})
