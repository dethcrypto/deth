import {
  expectReturn,
  expectGas,
  memoryGas,
  Int256,
  expectStorage,
} from '../helpers'
import { GasCost } from '../../src/opcodes'
import { Bytes } from '../../src/Bytes'

describe('RETURN opcode', () => {
  it('halts execution', () => {
    expectStorage('PUSH1 00 PUSH1 00 RETURN PUSH1 01 PUSH1 00 SSTORE', {
      '00': Int256.of(0),
    })
  })

  it(`uses ${GasCost.ZERO} gas`, () => {
    expectGas('PUSH1 00 PUSH1 00 RETURN', GasCost.VERYLOW * 2 + GasCost.ZERO)
  })

  it('can return empty', () => {
    expectReturn('PUSH1 00 PUSH1 00 RETURN', Bytes.EMPTY)
  })

  it('can return selected bytes from memory', () => {
    const assembly = `
      PUSH4 01020304
      PUSH1 00
      MSTORE
      PUSH1 05
      PUSH1 1C
      RETURN
    `
    expectReturn(assembly, Bytes.fromString('0102030400'))
  })

  it('causes memory expansion', () => {
    const assembly = `
      PUSH1 02
      PUSH3 100001
      RETURN
    `
    const gas = GasCost.VERYLOW * 2 + GasCost.ZERO + memoryGas(0x100001 + 2)
    expectGas(assembly, gas)
  })
})
