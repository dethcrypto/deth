import {
  expectStorage,
  Int256,
  expectGas,
  expectReturn,
  assemblyToBytecode,
  memoryGas,
  expectUnderflow,
} from '../helpers'
import { GasCost } from '../../src/opcodes'

describe('CODESIZE opcode', () => {
  it('returns the code size of the current environment', () => {
    expectStorage('CODESIZE PUSH1 00 SSTORE', {
      [Int256.of(0)]: Int256.of(4),
    })
  })

  it(`costs ${GasCost.BASE} gas`, () => {
    expectGas('CODESIZE', GasCost.BASE)
  })
})

describe('CODECOPY opcode', () => {
  it('copies the code to the memory', () => {
    const assembly = `
      PUSH1 0C
      PUSH1 00
      PUSH1 42
      CODECOPY
      PUSH1 0C
      PUSH1 42
      RETURN
    `
    expectReturn(assembly, assemblyToBytecode(assembly))
  })

  it('uses a formula to calculate gas cost', () => {
    const assembly = `
      PUSH1 42
      PUSH1 00
      PUSH1 69
      CODECOPY
    `
    const gas = (
      GasCost.VERYLOW * 3 +
      GasCost.VERYLOW +
      GasCost.COPY * Math.ceil(0x42 / 32) +
      memoryGas(0x69 + 0x42)
    )
    expectGas(assembly, gas)
  })

  it('can cause stack underflow', () => {
    expectUnderflow('CODECOPY', 3)
  })
})
