import { expect } from 'chai'
import { StackUnderflow } from '../../src/errors'
import { executeAssembly, ADDRESS_ZERO } from './executeAssembly'
import { Int256 } from './Int256'
import { Bytes32 } from '../../src/Bytes32'
import { Byte } from '../../src/Byte'

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

export function expectStackTop (assembly: string, value: string) {
  const account = ADDRESS_ZERO
  const result = executeAssembly(assembly + ' PUSH1 00 SSTORE', { account })
  const item = result.state.getStorage(account, Bytes32.ZERO)
  expect(item.toHex()).to.equal(value)
}

export function expectGas (assembly: string, gasUsed: number) {
  const result = executeAssembly(assembly)
  expect(result.gasUsed).to.equal(gasUsed)
}

export function expectRefund (assembly: string, refund: number) {
  const result = executeAssembly(assembly)
  expect(result.gasRefund).to.equal(refund)
}

export function expectError (assembly: string, error: unknown) {
  const result = executeAssembly(assembly)
  expect(result.error).to.be.instanceOf(error)
}

export function expectReturn (assembly: string, value: Byte[]) {
  const result = executeAssembly(assembly)
  expect(result.reverted).to.equal(false)
  expect(result.returnValue).to.deep.equal(value)
}

export function expectRevert (assembly: string, value: Byte[]) {
  const result = executeAssembly(assembly)
  expect(result.reverted).to.equal(true)
  expect(result.returnValue).to.deep.equal(value)
}

export function expectStorage (assembly: string, values: Record<string, string>) {
  const account = ADDRESS_ZERO
  const result = executeAssembly(assembly, { account })
  const resultingStorage: Record<string, string> = {}
  for (const key in values) {
    const location = Bytes32.fromHex(key)
    resultingStorage[key] = result.state.getStorage(account, location).toHex()
  }
  expect(resultingStorage).to.deep.equal(values)
}
