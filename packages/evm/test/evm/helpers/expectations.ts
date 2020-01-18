import { expect } from 'chai'
import { StackUnderflow } from '../../../src/evm/errors'
import { executeAssembly } from './executeAssembly'
import { Int256 } from './Int256'

export function expectUnderflow (opcode: string, minimumDepth: number) {
  for (let i = 0; i < minimumDepth; i++) {
    expectError(`${'PUSH1 00 '.repeat(i)} ${opcode}`, StackUnderflow)
  }
}

export function makeStack (depth: number) {
  return new Array(depth)
    .fill(0)
    .map((value, index) => Int256.of(depth - index))
}

export function expectStack (assembly: string, stack: string[]) {
  const result = executeAssembly(assembly)
  const items = result.stack['items'].map(x => x.toHexString())
  expect(items).to.deep.equal(stack)
}

export function expectGas (assembly: string, gasUsed: number) {
  const result = executeAssembly(assembly)
  expect(result.gasUsed).to.equal(gasUsed)
}

export function expectError (assembly: string, error: unknown) {
  const result = executeAssembly(assembly)
  expect(result.error).to.be.instanceOf(error)
}

export function expectReturn (assembly: string, value: number[]) {
  const result = executeAssembly(assembly)
  expect(result.reverted).to.equal(false)
  expect(result.returnValue).to.deep.equal(value)
}

export function expectRevert (assembly: string, value: number[]) {
  const result = executeAssembly(assembly)
  expect(result.reverted).to.equal(true)
  expect(result.returnValue).to.deep.equal(value)
}
