import { expect } from 'chai'
import { StackUnderflow } from '../../src/errors'
import { executeAssembly, ADDRESS_ZERO } from './executeAssembly'
import { Int256 } from './Int256'
import { Bytes32 } from '../../src/Bytes32'
import { Bytes } from '../../src/Bytes'
import { ExecutionSuccess } from '../../src/ExecutionResult'

export function expectUnderflow(opcode: string, minimumDepth: number) {
  for (let i = 0; i < minimumDepth; i++) {
    expectError(`${'PUSH1 00 '.repeat(i)} ${opcode}`, StackUnderflow)
  }
}

export function makeStack(depth: number) {
  return new Array(depth)
    .fill(0)
    .map((value, index) => Int256.of(depth - index))
}

// TODO: This function does not work if you return early !!!
export function expectStackTop(assembly: string, value: string) {
  const account = ADDRESS_ZERO
  const result = executeAssembly(assembly + ' PUSH1 00 SSTORE', { account })
  if (result.type !== 'ExecutionSuccess') {
    throw new Error(result.type)
  }
  const item = result.state.getStorage(account, Bytes32.ZERO)
  expect(item.toHex()).to.equal(value)
}

export function expectGas(assembly: string, gasUsed: number) {
  const result = executeAssembly(assembly)
  expect(result).to.include({ gasUsed })
}

export function expectRefund(assembly: string, gasRefund: number) {
  const result = executeAssembly(assembly)
  expect(result).to.include({ gasRefund })
}

export function expectError(assembly: string, error: unknown) {
  const result = executeAssembly(assembly)
  expect(result.type).to.equal('ExecutionError')
  expect((result as any).error).to.be.instanceOf(error)
}

export function expectReturn(assembly: string, value: Bytes) {
  const result = executeAssembly(assembly)
  expect(result.type).to.equal('ExecutionSuccess')
  expect((result as any).returnValue).to.deep.equal(value)
}

export function expectRevert(assembly: string, value: Bytes) {
  const result = executeAssembly(assembly)
  expect(result.type).to.equal('ExecutionRevert')
  expect((result as any).returnValue).to.deep.equal(value)
}

export function expectStorage(
  assembly: string,
  values: Record<string, string>
) {
  const account = ADDRESS_ZERO
  const result = executeAssembly(assembly, { account })
  const resultingStorage: Record<string, string> = {}
  expect(result.type).to.equal('ExecutionSuccess')
  const state = (result as ExecutionSuccess).state
  for (const key in values) {
    const location = Bytes32.fromHex(key)
    resultingStorage[key] = state.getStorage(account, location).toHex()
  }
  expect(resultingStorage).to.deep.equal(values)
}
