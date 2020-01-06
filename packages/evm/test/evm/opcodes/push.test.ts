import { expect } from 'chai'
import { executeAssembly } from '../executeAssembly'
import { GasCost } from '../../../src/evm/opcodes/gasCosts'

describe('PUSH* opcodes', () => {
  for (let i = 1; i <= 32; i++) {
    testPushN(i)
  }
})

function testPushN (n: number) {
  describe(`PUSH${n}`, () => {
    const bytes = new Array(n).fill(0)
      .map((value, index) => (index + 1).toString(16).padStart(2, '0'))
      .join('')

    it('pushes a value onto the stack', () => {
      const result = executeAssembly(`PUSH${n} ${bytes}`)
      expect(result.stack.pop().toHexString()).to.equal(bytes.padStart(64, '0'))
    })

    it(`uses ${GasCost.VERYLOW} gas`, () => {
      const result = executeAssembly(`PUSH${n} ${bytes}`)
      expect(result.gasUsed).to.equal(GasCost.VERYLOW)
    })

    xit('results in stackoverflow after 1024 items')
  })
}
