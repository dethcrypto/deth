import { GasCost } from '../../src/opcodes/gasCosts'
import { Int256, expectGas, expectStack, expectReturn } from '../helpers'

describe('STOP opcode', () => {
  it(`uses ${GasCost.ZERO} gas`, () => {
    expectGas('STOP', GasCost.ZERO)
  })

  it('halts execution', () => {
    expectStack('PUSH1 00 STOP NEG', [Int256.of(0)])
  })

  it('returns empty', () => {
    expectReturn('STOP', [])
  })
})
