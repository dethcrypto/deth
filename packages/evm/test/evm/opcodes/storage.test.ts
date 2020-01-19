import { expect } from 'chai'
import { GasCost, GasRefund } from '../../../src/evm/opcodes'
import {
  expectGas,
  expectUnderflow,
  expectStorage,
  Int256,
  executeAssembly,
  expectStack,
} from '../helpers'
import { OutOfGas } from '../../../src/evm/errors'

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

    describe('refund', () => {
      it(`gets ${GasRefund.SCLEAR} refund when changing non-zero`, () => {
        // NOTE: we do a "redundant" SSTORE here to make total gas larger than refund * 2
        const assembly = `
          PUSH1 01
          PUSH1 00
          SSTORE
          PUSH1 01
          PUSH1 01
          SSTORE
          PUSH1 00
          PUSH1 00
          SSTORE
        `
        const gas = GasCost.VERYLOW * 6 + GasCost.SSET * 2 + GasCost.SRESET - GasRefund.SCLEAR
        expectGas(assembly, gas)
      })

      it('the refund is limited to half of the gas used', () => {
        const assembly = `
          PUSH1 01
          PUSH1 00
          SSTORE
          PUSH1 00
          PUSH1 00
          SSTORE
        `
        const gasUsed = GasCost.VERYLOW * 4 + GasCost.SSET + GasCost.SRESET
        const refund = Math.floor(gasUsed / 2)
        expectGas(assembly, gasUsed - refund)
      })

      it('ignores refund in case of out of gas', () => {
        const assembly = `
          PUSH1 01
          PUSH1 00
          SSTORE
          PUSH1 00
          PUSH1 00
          SSTORE
        `
        const gasUsed = GasCost.VERYLOW * 4 + GasCost.SSET + GasCost.SRESET
        const refund = Math.floor(gasUsed / 2)

        const result = executeAssembly(assembly, { gasLimit: gasUsed - refund })
        expect(result.error).to.be.instanceOf(OutOfGas)
      })
    })
  })

  describe('SLOAD', () => {
    it(`uses ${GasCost.SLOAD} gas`, () => {
      expectGas('PUSH1 00 SLOAD', GasCost.VERYLOW + GasCost.SLOAD)
    })

    it('can cause a stack underflow', () => {
      expectUnderflow('SLOAD', 1)
    })

    it('can get a value from storage where it defaults to 0', () => {
      expectStack('PUSH1 00 SLOAD', [Int256.of(0)])
    })

    it('can get a previously set value from storage', () => {
      expectStack('PUSH1 01 PUSH1 00 SSTORE PUSH1 00 SLOAD', [Int256.of(1)])
    })
  })
})
