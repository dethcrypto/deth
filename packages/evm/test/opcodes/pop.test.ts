import { GasCost } from '../../src/opcodes/gasCosts'
import { Int256, expectUnderflow, expectGas, expectStackTop } from '../helpers'

describe('POP opcode', () => {
  it(`uses ${GasCost.BASE} gas`, () => {
    expectGas('PUSH1 00 POP', GasCost.VERYLOW + GasCost.BASE)
  })

  it('pops an item from the stack', () => {
    expectStackTop('PUSH1 01 PUSH1 02 POP', Int256.of(1))
  })

  it('can cause a stack underflow', () => {
    expectUnderflow('POP', 1)
  })
})
