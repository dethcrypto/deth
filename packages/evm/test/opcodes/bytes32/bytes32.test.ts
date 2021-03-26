import { TestCases } from './cases'
import { TestCase } from './cases/helpers'
import { expectGas, expectStackTop } from '../../helpers'
import { GasCost } from '../../../src/opcodes'

describe('bytes32 opcodes', () => {
  runTestCases('ADD', TestCases.ADD)
  runTestCases('MUL', TestCases.MUL)
  runTestCases('SUB', TestCases.SUB)
  runTestCases('DIV', TestCases.DIV)
  runTestCases('SDIV', TestCases.SDIV)
  runTestCases('MOD', TestCases.MOD)
  runTestCases('SMOD', TestCases.SMOD)
  runTestCases('ADDMOD', TestCases.ADDMOD)
  runTestCases('MULMOD', TestCases.MULMOD)
  runTestCases('EXP', TestCases.EXP)
  runTestCases('SIGNEXTEND', TestCases.SIGNEXTEND)
  runTestCases('LT', TestCases.LT)
  runTestCases('SLT', TestCases.SLT)
  runTestCases('GT', TestCases.GT)
  runTestCases('SGT', TestCases.SGT)
  runTestCases('EQ', TestCases.EQ)
  runTestCases('ISZERO', TestCases.ISZERO)
  runTestCases('AND', TestCases.AND)
  runTestCases('OR', TestCases.OR)
  runTestCases('XOR', TestCases.XOR)
  runTestCases('NOT', TestCases.NOT)
  runTestCases('BYTE', TestCases.BYTE)
  runTestCases('SHL', TestCases.SHL)
  runTestCases('SHR', TestCases.SHR)
  runTestCases('SAR', TestCases.SAR)

  describe('gas costs', () => {
    testGasPushN(2, 'ADD', GasCost.VERYLOW)
    testGasPushN(2, 'MUL', GasCost.LOW)
    testGasPushN(2, 'SUB', GasCost.VERYLOW)
    testGasPushN(2, 'DIV', GasCost.LOW)
    testGasPushN(2, 'SDIV', GasCost.LOW)
    testGasPushN(2, 'MOD', GasCost.LOW)
    testGasPushN(2, 'SMOD', GasCost.LOW)
    testGasPushN(3, 'ADDMOD', GasCost.MID)
    testGasPushN(3, 'MULMOD', GasCost.MID)
    // TODO: EXP
    testGasPushN(2, 'SIGNEXTEND', GasCost.LOW)
    testGasPushN(2, 'LT', GasCost.VERYLOW)
    testGasPushN(2, 'GT', GasCost.VERYLOW)
    testGasPushN(2, 'SLT', GasCost.VERYLOW)
    testGasPushN(2, 'SGT', GasCost.VERYLOW)
    testGasPushN(2, 'EQ', GasCost.VERYLOW)
    testGasPushN(1, 'ISZERO', GasCost.VERYLOW)
    testGasPushN(2, 'AND', GasCost.VERYLOW)
    testGasPushN(2, 'OR', GasCost.VERYLOW)
    testGasPushN(2, 'XOR', GasCost.VERYLOW)
    testGasPushN(1, 'NOT', GasCost.VERYLOW)
    testGasPushN(2, 'BYTE', GasCost.VERYLOW)
    testGasPushN(2, 'SHL', GasCost.VERYLOW)
    testGasPushN(2, 'SHR', GasCost.VERYLOW)
    testGasPushN(2, 'SAR', GasCost.VERYLOW)
  })
})

function runTestCases(opcode: string, testCases: TestCase[]) {
  describe('Opcode: ' + opcode, () => {
    for (const testCase of testCases) {
      it(testCase.title, () => {
        const assembly = testCase.stack
          .map((x) => `PUSH32 ${x}`)
          .concat([opcode])
          .join(' ')
        expectStackTop(assembly, testCase.expected)
      })
    }
  })
}

function testGasPushN(n: number, opcode: string, expectedGas: number) {
  it(`${opcode} uses ${expectedGas} gas`, () => {
    expectGas('PUSH1 00 '.repeat(n) + opcode, GasCost.VERYLOW * n + expectedGas)
  })
}
