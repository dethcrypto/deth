import { GasCost } from '../../src/opcodes'
import { expectGas, memoryGas, expectStack, Int256, expectUnderflow } from '../helpers'

describe('Memory opcodes', () => {
  describe('MSIZE', () => {
    it(`uses ${GasCost.BASE} gas`, () => {
      expectGas('MSIZE', GasCost.BASE)
    })

    it('returns 0 initially', () => {
      expectStack('MSIZE', [Int256.of(0)])
    })

    it('returns the size of memory used', () => {
      const assembly = 'PUSH1 00 PUSH3 100001 MSTORE MSIZE'
      const expected = Math.ceil((0x100001 + 32) / 32) * 32
      expectStack(assembly, [Int256.of(expected)])
    })
  })

  describe('MSTORE', () => {
    it(`uses ${GasCost.VERYLOW} gas and causes memory expansion`, () => {
      const assembly = `
        PUSH2 BABA
        DUP1
        DUP1
        PUSH1 00
        MSTORE
        PUSH3 100001
        MSTORE
        PUSH1 01
        MSTORE
      `
      const gas = GasCost.VERYLOW * 9 + memoryGas(0x100001 + 32)
      expectGas(assembly, gas)
    })

    it('stores data in memory', () => {
      const word = '1234567890abcdef'.repeat(4)
      const assembly = `
        PUSH32 ${word}
        PUSH1 00
        MSTORE
        PUSH1 00
        MLOAD
      `
      expectStack(assembly, [word])
    })

    it('can cause stack underflow', () => {
      expectUnderflow('MSTORE', 2)
    })
  })

  describe('MSTORE8', () => {
    it(`uses ${GasCost.VERYLOW} gas and causes memory expansion`, () => {
      const assembly = `
        PUSH2 BABA
        DUP1
        DUP1
        PUSH1 00
        MSTORE8
        PUSH3 100001
        MSTORE8
        PUSH1 01
        MSTORE8
      `
      const gas = GasCost.VERYLOW * 9 + memoryGas(0x100001 + 1)
      expectGas(assembly, gas)
    })

    it('stores a single byte in memory', () => {
      const word = '1234567890abcdef'.repeat(4)
      const assembly = `
        PUSH32 ${word}
        PUSH1 00
        MSTORE8
        PUSH1 00
        MLOAD
      `
      expectStack(assembly, ['ef'.padEnd(64, '0')])
    })

    it('can cause stack underflow', () => {
      expectUnderflow('MSTORE8', 2)
    })
  })

  describe('MLOAD', () => {
    it(`uses ${GasCost.VERYLOW} gas and causes memory expansion`, () => {
      const assembly = `
        PUSH1 00
        MLOAD
        PUSH3 100001
        MLOAD
        PUSH1 01
        MLOAD
      `
      const gas = GasCost.VERYLOW * 6 + memoryGas(0x100001 + 32)
      expectGas(assembly, gas)
    })

    it('loads data from memory', () => {
      const assembly = `
        PUSH32 ${'e'.repeat(64)}
        PUSH1 00
        MSTORE
        PUSH32 ${'b'.repeat(64)}
        PUSH1 20
        MSTORE
        PUSH1 10
        MLOAD
      `
      expectStack(assembly, ['e'.repeat(32) + 'b'.repeat(32)])
    })

    it('can cause stack underflow', () => {
      expectUnderflow('MLOAD', 1)
    })
  })
})
