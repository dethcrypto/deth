import { expect } from 'chai'
import { executeAssembly } from '../helpers'
import { GasCost } from '../../../src/evm/opcodes/gasCosts'
import { StackOverflow } from '../../../src/evm/errors'

describe('PUSH* opcodes', () => {
  for (let n = 1; n <= 32; n++) {
    describe(`PUSH${n}`, () => {
      const bytes = new Array(n).fill(0)
        .map((value, index) => (index + 1).toString(16).padStart(2, '0'))
        .join('')

      it('pushes a value onto the stack', () => {
        const result = executeAssembly(`PUSH${n} ${bytes}`)
        expect(result.error).to.equal(undefined)
        expect(result.stack.pop().toHexString()).to.equal(bytes.padStart(64, '0'))
      })

      it(`uses ${GasCost.VERYLOW} gas`, () => {
        const result = executeAssembly(`PUSH${n} ${bytes}`)
        expect(result.error).to.equal(undefined)
        expect(result.gasUsed).to.equal(GasCost.VERYLOW)
      })
    })
  }

  it('results in stackoverflow eventually', () => {
    const result = executeAssembly('JUMPDEST PUSH1 00 PUSH1 00 JUMP')
    expect(result.error).to.be.instanceOf(StackOverflow)
  })
})
