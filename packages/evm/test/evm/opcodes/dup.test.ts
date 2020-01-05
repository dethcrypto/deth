import { expect } from 'chai'
import { executeAssembly } from '../executeAssembly'
import { GasCost } from '../../../src/evm/opcodes/gasCosts'
import { StackUnderflow } from '../../../src/evm/errors'

describe('DUP* opcodes', () => {
  for (let i = 1; i <= 16; i++) {
    testDupN(i)
  }
})

const stack = new Array(16).fill(0)
  .map((value, index) => (16 - index).toString(16).padStart(64, '0'))

const assembly = stack
  .map((value) => `PUSH32 ${value}`)
  .join(' ')

function testDupN (n: number) {
  describe(`DUP${n}`, () => {
    it('duplicates the value on the stack', () => {
      const result = executeAssembly(`${assembly} DUP${n}`)
      expect(result.stack.pop().toHexString()).to.equal(stack[stack.length - n])
    })

    for (let i = 0; i < n; i++) {
      it(`fails for stack of depth ${i}`, () => {
        const result = executeAssembly(`${'PUSH1 00 '.repeat(i)} DUP${n}`)
        expect(result.error).to.be.instanceOf(StackUnderflow)
      })
    }

    it(`uses ${GasCost.VERYLOW} gas`, () => {
      const result = executeAssembly(`${assembly} DUP${n}`)
      expect(result.gasUsed - GasCost.VERYLOW * 16).to.equal(GasCost.VERYLOW)
    })
  })
}
