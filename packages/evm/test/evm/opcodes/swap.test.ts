import { expect } from 'chai'
import { executeAssembly } from '../executeAssembly'
import { GasCost } from '../../../src/evm/opcodes/gasCosts'
import { MachineWord } from '../../../src/evm/MachineWord'
import { expectUnderflow } from './helpers'

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
        expect(result.error).to.equal(undefined)
      })

      it('can cause a stack underflow', () => {
        expectUnderflow(`SWAP${n}`, n + 1)
      })

      it(`uses ${GasCost.VERYLOW} gas`, () => {
        const result = executeAssembly(`${assembly} SWAP${n}`)
        expect(result.error).to.equal(undefined)
        expect(result.gasUsed - GasCost.VERYLOW * 17).to.equal(GasCost.VERYLOW)
      })
    })
  }
})
