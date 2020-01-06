import { expect } from 'chai'
import { executeAssembly } from '../executeAssembly'
import { InvalidOpcode } from '../../../src/evm/errors'

describe('invalid opcodes', () => {
  const opcodes = [
    ...range('0c', '0f'),
    ...range('21', '2f'),
    '3f',
    ...range('46', '4f'),
    ...range('5c', '5f'),
    ...range('a5', 'ef'),
    ...range('f6', 'f9'),
    'fe',
  ]
  for (const opcode of opcodes) {
    it(`opcode ${opcode} is invalid`, () => {
      const result = executeAssembly(opcode)
      expect(result.error).to.be.instanceOf(InvalidOpcode)
    })

    xit(`opcode ${opcode} uses all remaining gas`)
  }
})

function range (from: string, to: string) {
  const start = parseInt(from, 16)
  const end = parseInt(to, 16)
  const result = []
  for (let i = start; i <= end; i++) {
    result.push(i.toString(16).padStart(2, '0'))
  }
  return result
}
