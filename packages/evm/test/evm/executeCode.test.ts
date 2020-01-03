import { expect } from 'chai'
import { TestCases } from './cases'
import { TestCase } from './cases/helpers'
import { executeAssembly } from './executeAssembly'

describe('executeCode', () => {
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
})

function runTestCases (opcode: string, testCases: TestCase[]) {
  describe('Opcode: ' + opcode, () => {
    for (const testCase of testCases) {
      it(testCase.title, () => {
        const assembly = testCase.stack
          .map(x => `PUSH32 ${x}`)
          .concat(opcode)
          .join(' ')
        const ctx = executeAssembly(assembly)
        const result = ctx.stack.pop()
        expect(result.toHexString()).to.equal(testCase.expected)
      })
    }
  })
}
