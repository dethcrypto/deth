import { expect } from 'chai'
import { executeAssembly } from '../executeAssembly'
import { StackUnderflow } from '../../../src/evm/errors'

export function expectUnderflow (opcode: string, minimumDepth: number) {
  for (let i = 0; i < minimumDepth; i++) {
    const result = executeAssembly(`${'PUSH1 00 '.repeat(i)} ${opcode}`)
    expect(result.error).to.be.instanceOf(StackUnderflow)
  }
}
