import { expect } from 'chai'
import { executeAssembly } from '../executeAssembly'
import { GasCost } from '../../../src/evm/opcodes/gasCosts'
import { StackUnderflow } from '../../../src/evm/errors'
import { MachineWord } from '../../../src/evm/MachineWord'

describe('SWAP* opcodes', () => {
  const stack = new Array(17).fill(0)
    .map((value, index) => (17 - index).toString(16).padStart(64, '0'))

  const assembly = stack
    .map((value) => `PUSH32 ${value}`)
    .join(' ')

  for (let n = 1; n <= 16; n++) {
    describe(`SWAP${n}`, () => {
      it('swaps the values on the stack', () => {
        const result = executeAssembly(`${assembly} SWAP${n}`)
        const expected = [...stack]
        expected[expected.length - 1] = stack[expected.length - 1 - n]
        expected[expected.length - 1 - n] = stack[expected.length - 1]

        const resultItems = (result.stack as unknown as { items: MachineWord[] }).items
          .map(x => x.toHexString())
        expect(resultItems).to.deep.equal(expected)
      })

      for (let i = 0; i <= n; i++) {
        it(`fails for stack of depth ${i}`, () => {
          const result = executeAssembly(`${'PUSH1 00 '.repeat(i)} SWAP${n}`)
          expect(result.error).to.be.instanceOf(StackUnderflow)
        })
      }

      it(`uses ${GasCost.VERYLOW} gas`, () => {
        const result = executeAssembly(`${assembly} SWAP${n}`)
        expect(result.gasUsed - GasCost.VERYLOW * 17).to.equal(GasCost.VERYLOW)
      })
    })
  }
})
