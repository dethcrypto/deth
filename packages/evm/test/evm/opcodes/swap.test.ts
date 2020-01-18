import { GasCost } from '../../../src/evm/opcodes/gasCosts'
import { expectUnderflow, makeStack, expectStack, expectGas } from '../helpers'

describe('SWAP* opcodes', () => {
  const stack = makeStack(17)

  const assembly = stack
    .map((value) => `PUSH32 ${value}`)
    .join(' ')

  for (let n = 1; n <= 16; n++) {
    describe(`SWAP${n}`, () => {
      it('swaps the values on the stack', () => {
        const expected = [...stack]
        expected[expected.length - 1] = stack[expected.length - 1 - n]
        expected[expected.length - 1 - n] = stack[expected.length - 1]
        expectStack(`${assembly} SWAP${n}`, expected)
      })

      it('can cause a stack underflow', () => {
        expectUnderflow(`SWAP${n}`, n + 1)
      })

      it(`uses ${GasCost.VERYLOW} gas`, () => {
        expectGas(`${assembly} SWAP${n}`, GasCost.VERYLOW * 18)
      })
    })
  }
})
