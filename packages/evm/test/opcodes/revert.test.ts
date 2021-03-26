import { expectGas, memoryGas, expectRevert } from '../helpers'
import { GasCost } from '../../src/opcodes'
import { Bytes } from '../../src/Bytes'

describe('REVERT opcode', () => {
  it(`uses ${GasCost.ZERO} gas`, () => {
    expectGas('PUSH1 00 PUSH1 00 REVERT', GasCost.VERYLOW * 2 + GasCost.ZERO)
  })

  it('can return empty', () => {
    expectRevert('PUSH1 00 PUSH1 00 REVERT', Bytes.EMPTY)
  })

  it('can return selected bytes from memory', () => {
    const assembly = `
      PUSH4 01020304
      PUSH1 00
      MSTORE
      PUSH1 05
      PUSH1 1C
      REVERT
    `
    expectRevert(assembly, Bytes.fromHex('0102030400'))
  })

  it('causes memory expansion', () => {
    const assembly = `
      PUSH1 02
      PUSH3 100001
      REVERT
    `
    const gas = GasCost.VERYLOW * 2 + GasCost.ZERO + memoryGas(0x100001 + 2)
    expectGas(assembly, gas)
  })
})
