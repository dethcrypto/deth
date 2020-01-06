import { expect } from 'chai'
import { GasCost } from '../../../src/evm/opcodes/gasCosts'
import { executeAssembly } from '../executeAssembly'
import { Int256 } from './machineWord/cases/helpers'
import { InvalidJumpDestination, StackUnderflow } from '../../../src/evm/errors'

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

    it('fails to jump with an empty stack', () => {
      const result = executeAssembly('JUMP')
      expect(result.error).to.be.instanceOf(StackUnderflow)
    })
  })
})
