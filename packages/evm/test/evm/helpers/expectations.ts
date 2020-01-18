import { expect } from 'chai'
import { StackUnderflow } from '../../../src/evm/errors'
import { ExecutionResult } from '../../../src/evm/executeCode'
import { executeAssembly } from './executeAssembly'
import { Int256 } from './Int256'

export function expectUnderflow (opcode: string, minimumDepth: number) {
  for (let i = 0; i < minimumDepth; i++) {
    const result = executeAssembly(`${'PUSH1 00 '.repeat(i)} ${opcode}`)
    expect(result.error).to.be.instanceOf(StackUnderflow)
  }
}

export function makeStack (depth: number) {
  new Array(depth)
    .fill(0)
    .map((value, index) => Int256.of(depth - index))
}

export function expectStack (result: ExecutionResult, stack: string[]) {
  const items = result.stack['items'].map(x => x.toHexString())
  expect(items).to.deep.equal(stack)
}
