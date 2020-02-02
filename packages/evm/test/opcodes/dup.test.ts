import { GasCost } from '../../src/opcodes/gasCosts'
import { makeStack, expectUnderflow, expectGas, expectStackTop } from '../helpers'

describe('DUP* opcodes', () => {
  const stack = makeStack(16)
  const assembly = stack
    .map(value => `PUSH32 ${value}`)
    .join(' ')

  for (let n = 1; n <= 16; n++) {
    describe(`DUP${n}`, () => {
      it('duplicates the value on the stack', () => {
        expectStackTop(`${assembly} DUP${n}`, stack[stack.length - n])
      })

      it('can cause stack underflow', () => {
        expectUnderflow(`DUP${n}`, n)
      })

      it(`uses ${GasCost.VERYLOW} gas`, () => {
        expectGas(`${assembly} DUP${n}`, GasCost.VERYLOW * 17)
      })
    })
  }
})
