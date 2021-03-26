import { expectStackTop, expectGas, expectError } from '../helpers'
import { GasCost } from '../../src/opcodes/gasCosts'
import { StackOverflow } from '../../src/errors'

describe('PUSH* opcodes', () => {
  for (let n = 1; n <= 32; n++) {
    describe(`PUSH${n}`, () => {
      const bytes = new Array(n)
        .fill(0)
        .map((value, index) => (index + 1).toString(16).padStart(2, '0'))
        .join('')

      it('pushes a value onto the stack', () => {
        expectStackTop(`PUSH${n} ${bytes}`, bytes.padStart(64, '0'))
      })

      it(`uses ${GasCost.VERYLOW} gas`, () => {
        expectGas(`PUSH${n} ${bytes}`, GasCost.VERYLOW)
      })
    })
  }

  it('results in stackoverflow eventually', () => {
    expectError('JUMPDEST PUSH1 00 PUSH1 00 JUMP', StackOverflow)
  })
})
