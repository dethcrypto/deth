import { GasCost } from '../../../src/evm/opcodes/gasCosts'
import { InvalidJumpDestination } from '../../../src/evm/errors'
import { Int256, expectUnderflow, expectGas, expectStack, expectError } from '../helpers'

describe('JUMP* opcodes', () => {
  describe('JUMPDEST', () => {
    it(`uses ${GasCost.JUMPDEST} gas`, () => {
      expectGas('JUMPDEST', GasCost.JUMPDEST)
    })
  })

  describe('JUMP', () => {
    it(`uses ${GasCost.MID} gas`, () => {
      const assembly = 'PUSH1 03 JUMP JUMPDEST'
      const gas = GasCost.VERYLOW + GasCost.JUMPDEST + GasCost.MID
      expectGas(assembly, gas)
    })

    it('jumps to a specified location in code', () => {
      const assembly = 'PUSH1 04 JUMP STOP JUMPDEST PUSH1 01'
      expectStack(assembly, [Int256.of(1)])
    })

    it('fails to jump to non JUMPDEST location', () => {
      expectError('PUSH1 00 JUMP', InvalidJumpDestination)
    })

    it('fails to jump to a JUMPDEST inside a push', () => {
      expectError('PUSH1 JUMPDEST PUSH1 01 JUMP', InvalidJumpDestination)
    })

    it('can cause a stack underflow', () => {
      expectUnderflow('JUMP', 1)
    })
  })

  describe('JUMPI', () => {
    it(`uses ${GasCost.HIGH} gas`, () => {
      const assembly = 'PUSH1 01 PUSH1 05 JUMPI JUMPDEST'
      const gas = GasCost.VERYLOW * 2 + GasCost.JUMPDEST + GasCost.HIGH
      expectGas(assembly, gas)
    })

    it('jumps to a specified location in if condition is not zero', () => {
      const assembly = `
        PUSH1 01
        PUSH1 06
        JUMPI
        STOP
        JUMPDEST
        PUSH1 FF
      `
      expectStack(assembly, [Int256.of(0xff)])
    })

    it('does not jump if condition is zero', () => {
      const assembly = `
        PUSH1 00
        PUSH1 08
        JUMPI
        PUSH1 EE
        STOP
        JUMPDEST
        PUSH1 FF
      `
      expectStack(assembly, [Int256.of(0xee)])
    })

    it('fails to jump to non JUMPDEST location', () => {
      expectError('PUSH1 01 PUSH1 02 JUMPI', InvalidJumpDestination)
    })

    it('fails to jump to a JUMPDEST inside a push', () => {
      expectError('PUSH1 JUMPDEST PUSH1 01 JUMPI', InvalidJumpDestination)
    })

    it('can cause a stack underflow', () => {
      expectUnderflow('JUMPI', 2)
    })
  })
})
