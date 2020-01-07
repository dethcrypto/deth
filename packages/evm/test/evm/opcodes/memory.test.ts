import { expect } from 'chai'
import { executeAssembly } from '../executeAssembly'
import { GasCost } from '../../../src/evm/opcodes'

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

  it('MSTORE', () => {
    xit(`uses ${GasCost.VERYLOW} gas`)
    xit('causes memory expansion')
    xit('stores data in memory')
    xit('fails for stack of depth 1')
    xit('fails for stack of depth 0')
  })

  xit('MSTOR8', () => {
    xit(`uses ${GasCost.VERYLOW} gas`)
    xit('causes memory expansion')
    xit('stores data in memory')
    xit('fails for stack of depth 1')
    xit('fails for stack of depth 0')
  })

  xit('MLOAD', () => {
    xit(`uses ${GasCost.VERYLOW} gas`)
    xit('causes memory expansion')
    xit('loads data from memory')
    xit('fails for stack of depth 1')
    xit('fails for stack of depth 0')
  })
})
