import { expect } from 'chai'
import { executeAssembly } from './executeAssembly'
import { MachineWord } from '../../src/MachineWord'
import { GasCost } from '../../src/evm/opcodes/gasCosts'
import { negative } from '../utils'

describe('EVM - calculations', () => {
  it('ADD', () => testOpCode({
    opcode: 'ADD',
    stack: ['1', '2'],
    expectedResult: '3',
    expectedGas: GasCost.VERY_LOW,
  }))

  it('MUL', () => testOpCode({
    opcode: 'MUL',
    stack: ['2', '3'],
    expectedResult: '6',
    expectedGas: GasCost.LOW,
  }))

  it('SUB', () => testOpCode({
    opcode: 'SUB',
    stack: ['1', '3'],
    expectedResult: '2',
    expectedGas: GasCost.VERY_LOW,
  }))

  it('DIV', () => testOpCode({
    opcode: 'DIV',
    stack: ['2', '6'],
    expectedResult: '3',
    expectedGas: GasCost.LOW,
  }))

  it('SDIV', () => testOpCode({
    opcode: 'SDIV',
    stack: ['2', negative('6')],
    expectedResult: negative('3'),
    expectedGas: GasCost.LOW,
  }))

  it('MOD', () => testOpCode({
    opcode: 'MOD',
    stack: ['3', '5'],
    expectedResult: '2',
    expectedGas: GasCost.LOW,
  }))

  it('SMOD', () => testOpCode({
    opcode: 'SMOD',
    stack: ['3', negative('5')],
    expectedResult: negative('2'),
    expectedGas: GasCost.LOW,
  }))

  it('ADDMOD', () => testOpCode({
    opcode: 'ADDMOD',
    stack: ['3', '2', '5'],
    expectedResult: '1',
    expectedGas: GasCost.MEDIUM,
  }))

  it('MULMOD', () => testOpCode({
    opcode: 'MULMOD',
    stack: ['3', '2', '7'],
    expectedResult: '2',
    expectedGas: GasCost.MEDIUM,
  }))

  xit('EXP', () => {})

  it('SIGNEXTEND', () => testOpCode({
    opcode: 'SIGNEXTEND',
    stack: ['0'.repeat(32) + 'f'.repeat(31) + 'e', '0f'],
    expectedResult: 'f'.repeat(63) + 'e',
    expectedGas: GasCost.LOW,
  }))

  it('LT', () => testOpCode({
    opcode: 'LT',
    stack: ['2', '3'],
    expectedResult: '0',
    expectedGas: GasCost.VERY_LOW,
  }))

  it('GT', () => testOpCode({
    opcode: 'GT',
    stack: ['2', '3'],
    expectedResult: '1',
    expectedGas: GasCost.VERY_LOW,
  }))

  it('SLT', () => testOpCode({
    opcode: 'SLT',
    stack: ['2', negative('3')],
    expectedResult: '1',
    expectedGas: GasCost.VERY_LOW,
  }))

  it('SGT', () => testOpCode({
    opcode: 'SGT',
    stack: ['2', negative('3')],
    expectedResult: '0',
    expectedGas: GasCost.VERY_LOW,
  }))

  it('EQ', () => testOpCode({
    opcode: 'EQ',
    stack: ['1', '2'],
    expectedResult: '0',
    expectedGas: GasCost.VERY_LOW,
  }))

  it('EQ', () => testOpCode({
    opcode: 'EQ',
    stack: ['1', '1'],
    expectedResult: '1',
    expectedGas: GasCost.VERY_LOW,
  }))

  it('ISZERO', () => testOpCode({
    opcode: 'ISZERO',
    stack: ['42'],
    expectedResult: '0',
    expectedGas: GasCost.VERY_LOW,
  }))

  it('ISZERO', () => testOpCode({
    opcode: 'ISZERO',
    stack: ['0'],
    expectedResult: '1',
    expectedGas: GasCost.VERY_LOW,
  }))

  it('AND', () => testOpCode({
    opcode: 'AND',
    stack: ['0ff0', '00ff'],
    expectedResult: '00f0',
    expectedGas: GasCost.VERY_LOW,
  }))

  it('OR', () => testOpCode({
    opcode: 'OR',
    stack: ['0ff0', '00ff'],
    expectedResult: '0fff',
    expectedGas: GasCost.VERY_LOW,
  }))

  it('XOR', () => testOpCode({
    opcode: 'XOR',
    stack: ['0ff0', '00ff'],
    expectedResult: '0f0f',
    expectedGas: GasCost.VERY_LOW,
  }))

  it('NOT', () => testOpCode({
    opcode: 'NOT',
    stack: ['0'],
    expectedResult: negative('1'),
    expectedGas: GasCost.VERY_LOW,
  }))

  it('BYTE', () => testOpCode({
    opcode: 'BYTE',
    stack: [negative('1'), '3'],
    expectedResult: 'ff',
    expectedGas: GasCost.VERY_LOW,
  }))
})

interface OpCodeTest {
  opcode: string,
  stack: string[],
  expectedResult: string,
  expectedGas: number,
}

function testOpCode (testCase: OpCodeTest) {
  const assembly = testCase.stack
    .map(value => `PUSH32 ${value.padStart(64, '0')}`)
    .concat(testCase.opcode)
    .join(' ')
  const ctx = executeAssembly(assembly)

  const result = ctx.stack.pop()
  const expected = MachineWord.fromHexString(testCase.expectedResult)
  expect(result.toHexString()).to.equal(expected.toHexString())

  const pushGasCost = testCase.stack.length * GasCost.VERY_LOW
  expect(ctx.gasUsed - pushGasCost).to.equal(testCase.expectedGas)
}
