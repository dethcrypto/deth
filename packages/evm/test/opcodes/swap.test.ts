import { GasCost } from '../../src/opcodes/gasCosts'
import { expectUnderflow, makeStack, expectStackTop, expectGas } from '../helpers'

describe('SWAP* opcodes', () => {
  const stack = makeStack(17)

  const assembly = stack
    .map((value) => `PUSH32 ${value}`)
    .join(' ')

  for (let n = 1; n <= 16; n++) {
    describe(`SWAP${n}`, () => {
      it('swaps the values on the stack', () => {
        expectStackTop(`${assembly} SWAP${n}`, stack[stack.length - 1 - n])
        expectStackTop(`${assembly} SWAP${n} POP DUP${n}`, stack[stack.length - 1])
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
