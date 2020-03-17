import { GasCost } from '../../src/opcodes/gasCosts'
import { Int256, expectGas, expectStackTop, expectReturn } from '../helpers'
import { Bytes } from '../../src/Bytes'

describe('STOP opcode', () => {
  it(`uses ${GasCost.ZERO} gas`, () => {
    expectGas('STOP', GasCost.ZERO)
  })

  it('halts execution', () => {
    expectStackTop('PUSH1 00 STOP NOT', Int256.of(0))
  })

  it('returns empty', () => {
    expectReturn('STOP', Bytes.EMPTY)
  })
})
