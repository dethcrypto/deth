import { GasCost } from '../../../src/evm/opcodes'
import { expectGas, expectUnderflow, expectStorage, Int256 } from '../helpers'

describe('Storage opcodes', () => {
  describe('SSTORE', () => {
    it(`uses ${GasCost.SSET} gas when changing zero to non-zero`, () => {
      const assembly = 'PUSH1 01 PUSH1 00 SSTORE'
      const gas = GasCost.VERYLOW * 2 + GasCost.SSET
      expectGas(assembly, gas)
    })

    it(`uses ${GasCost.SRESET} gas when changing non-zero`, () => {
      const assembly = 'PUSH1 01 PUSH1 00 SSTORE PUSH1 02 PUSH1 00 SSTORE'
      const gas = GasCost.VERYLOW * 4 + GasCost.SSET + GasCost.SRESET
      expectGas(assembly, gas)
    })

    it('can manipulate storage', () => {
      const assembly = `
        PUSH1 01
        PUSH1 00
        SSTORE
        PUSH1 02
        PUSH1 01
        SSTORE
        PUSH1 03
        PUSH1 00
        SSTORE
      `
      expectStorage(assembly, {
        [Int256.of(0)]: Int256.of(3),
        [Int256.of(1)]: Int256.of(2),
        [Int256.of(2)]: Int256.of(0),
      })
    })

    it('can cause a stack underflow', () => {
      expectUnderflow('SSTORE', 2)
    })
  })
})
