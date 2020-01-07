import { expect } from 'chai'
import { executeAssembly } from '../executeAssembly'
import { GasCost } from '../../../src/evm/opcodes'
import { StackUnderflow } from '../../../src/evm/errors'

describe('Memory opcodes', () => {
  describe('MSIZE', () => {
    it(`uses ${GasCost.BASE} gas`, () => {
      const result = executeAssembly('MSIZE')
      expect(result.error).to.equal(undefined)
      expect(result.gasUsed).to.equal(GasCost.BASE)
    })

    it('returns 0 initially', () => {
      const result = executeAssembly('MSIZE')
      expect(result.error).to.equal(undefined)
      expect(result.stack.pop().toUnsignedNumber()).to.equal(0)
    })

    it('returns the size of memory used', () => {
      const result = executeAssembly('PUSH1 00 PUSH3 100001 MSTORE MSIZE')
      expect(result.error).to.equal(undefined)
      const expectedSize = Math.ceil((0x100001 + 32) / 32) * 32
      expect(result.stack.pop().toUnsignedNumber()).to.equal(expectedSize)
    })
  })

  const memoryGas = (bytes: number) => memoryGasWords(Math.ceil(bytes / 32))
  const memoryGasWords = (words: number) => words * 3 + Math.floor(words * words / 512)

  describe('MSTORE', () => {
    it(`uses ${GasCost.VERYLOW} gas and causes memory expansion`, () => {
      const result = executeAssembly(`
        PUSH2 BABA
        DUP1
        DUP1
        PUSH1 00
        MSTORE
        PUSH3 100001
        MSTORE
        PUSH1 01
        MSTORE
      `)
      expect(result.error).to.equal(undefined)
      expect(result.gasUsed).to.equal(
        GasCost.VERYLOW * 9 + // PUSH, DUP and MSTORE
        memoryGas(0x100001 + 32),
      )
    })

    it('stores data in memory', () => {
      const word = '1234567890abcdef'.repeat(4)
      const result = executeAssembly(`
        PUSH32 ${word}
        PUSH1 00
        MSTORE
        PUSH1 00
        MLOAD
      `)
      expect(result.error).to.equal(undefined)
      expect(result.stack.pop().toHexString()).to.equal(word)
    })

    it('fails for stack of depth 1', () => {
      const result = executeAssembly('PUSH1 00 MSTORE')
      expect(result.error).to.be.instanceOf(StackUnderflow)
    })

    it('fails for stack of depth 0', () => {
      const result = executeAssembly('MSTORE')
      expect(result.error).to.be.instanceOf(StackUnderflow)
    })
  })

  describe('MSTORE8', () => {
    it(`uses ${GasCost.VERYLOW} gas and causes memory expansion`, () => {
      const result = executeAssembly(`
        PUSH2 BABA
        DUP1
        DUP1
        PUSH1 00
        MSTORE8
        PUSH3 100001
        MSTORE8
        PUSH1 01
        MSTORE8
      `)
      expect(result.error).to.equal(undefined)
      expect(result.gasUsed).to.equal(
        GasCost.VERYLOW * 9 + // PUSH, DUP and MSTORE8
        memoryGas(0x100001 + 1),
      )
    })

    it('stores a single byte in memory', () => {
      const word = '1234567890abcdef'.repeat(4)
      const result = executeAssembly(`
        PUSH32 ${word}
        PUSH1 00
        MSTORE8
        PUSH1 00
        MLOAD
      `)
      expect(result.error).to.equal(undefined)
      expect(result.stack.pop().toHexString()).to.equal('ef'.padEnd(64, '0'))
    })

    it('fails for stack of depth 1', () => {
      const result = executeAssembly('PUSH1 00 MSTORE8')
      expect(result.error).to.be.instanceOf(StackUnderflow)
    })

    it('fails for stack of depth 0', () => {
      const result = executeAssembly('MSTORE8')
      expect(result.error).to.be.instanceOf(StackUnderflow)
    })
  })

  describe('MLOAD', () => {
    it(`uses ${GasCost.VERYLOW} gas and causes memory expansion`, () => {
      const result = executeAssembly(`
        PUSH1 00
        MLOAD
        PUSH3 100001
        MLOAD
        PUSH1 01
        MLOAD
      `)
      expect(result.error).to.equal(undefined)
      expect(result.gasUsed).to.equal(
        GasCost.VERYLOW * 6 + // PUSH, DUP and MLOAD
        memoryGas(0x100001 + 32),
      )
    })

    it('loads data from memory', () => {
      const result = executeAssembly(`
        PUSH32 ${'e'.repeat(64)}
        PUSH1 00
        MSTORE
        PUSH32 ${'b'.repeat(64)}
        PUSH1 20
        MSTORE
        PUSH1 10
        MLOAD
      `)
      expect(result.error).to.equal(undefined)
      const topOfStack = result.stack.pop().toHexString()
      const expected = 'e'.repeat(32) + 'b'.repeat(32)
      expect(topOfStack).to.equal(expected)
    })

    it('fails for stack of depth 0', () => {
      const result = executeAssembly('MLOAD')
      expect(result.error).to.be.instanceOf(StackUnderflow)
    })
  })
})
