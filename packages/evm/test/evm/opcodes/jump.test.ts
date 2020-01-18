import { expect } from 'chai'
import { GasCost } from '../../../src/evm/opcodes/gasCosts'
import { executeAssembly, Int256, expectUnderflow } from '../helpers'
import { InvalidJumpDestination } from '../../../src/evm/errors'

describe('JUMP* opcodes', () => {
  describe('JUMPDEST', () => {
    it(`uses ${GasCost.JUMPDEST} gas`, () => {
      const result = executeAssembly('JUMPDEST')
      expect(result.error).to.equal(undefined)
      expect(result.gasUsed).to.equal(GasCost.JUMPDEST)
    })
  })

  describe('JUMP', () => {
    it(`uses ${GasCost.MID} gas`, () => {
      const result = executeAssembly('PUSH1 03 JUMP JUMPDEST')
      expect(result.error).to.equal(undefined)
      expect(result.gasUsed - GasCost.VERYLOW - GasCost.JUMPDEST).to.equal(GasCost.MID)
    })

    it('jumps to a specified location in code', () => {
      const result = executeAssembly('PUSH1 04 JUMP STOP JUMPDEST PUSH1 01')
      expect(result.error).to.equal(undefined)
      expect(result.stack.pop().toHexString()).to.equal(Int256.of(1))
    })

    it('fails to jump to non JUMPDEST location', () => {
      const result = executeAssembly('PUSH1 00 JUMP')
      expect(result.error).to.be.instanceOf(InvalidJumpDestination)
    })

    it('fails to jump to a JUMPDEST inside a push', () => {
      const result = executeAssembly('PUSH1 JUMPDEST PUSH1 01 JUMP')
      expect(result.error).to.be.instanceOf(InvalidJumpDestination)
    })

    it('can cause a stack underflow', () => {
      expectUnderflow('JUMP', 1)
    })
  })

  describe('JUMPI', () => {
    it(`uses ${GasCost.HIGH} gas`, () => {
      const result = executeAssembly('PUSH1 01 PUSH1 05 JUMPI JUMPDEST')
      expect(result.error).to.equal(undefined)
      expect(result.gasUsed - GasCost.VERYLOW * 2 - GasCost.JUMPDEST).to.equal(GasCost.HIGH)
    })

    it('jumps to a specified location in if condition is not zero', () => {
      const result = executeAssembly(`
        PUSH1 01
        PUSH1 06
        JUMPI
        STOP
        JUMPDEST
        PUSH1 FF
      `)
      expect(result.error).to.equal(undefined)
      expect(result.stack.pop().toHexString()).to.equal(Int256.of(0xff))
    })

    it('does not jump if condition is zero', () => {
      const result = executeAssembly(`
        PUSH1 00
        PUSH1 08
        JUMPI
        PUSH1 EE
        STOP
        JUMPDEST
        PUSH1 FF
      `)
      expect(result.error).to.equal(undefined)
      expect(result.stack.pop().toHexString()).to.equal(Int256.of(0xee))
    })

    it('fails to jump to non JUMPDEST location', () => {
      const result = executeAssembly('PUSH1 01 PUSH1 02 JUMPI')
      expect(result.error).to.be.instanceOf(InvalidJumpDestination)
    })

    it('fails to jump to a JUMPDEST inside a push', () => {
      const result = executeAssembly('PUSH1 JUMPDEST PUSH1 01 JUMPI')
      expect(result.error).to.be.instanceOf(InvalidJumpDestination)
    })

    it('can cause a stack underflow', () => {
      expectUnderflow('JUMPI', 2)
    })
  })
})
