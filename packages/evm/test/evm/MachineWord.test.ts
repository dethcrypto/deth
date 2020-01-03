import { expect } from 'chai'
import { MachineWord } from '../../src/evm/MachineWord'
import { TestCases } from './cases'
import { TestCase } from './cases/helpers'

describe('MachineWord', () => {
  runTestCases('add', TestCases.ADD)
  runTestCases('multiply', TestCases.MUL)
  runTestCases('subtract', TestCases.SUB)
  runTestCases('unsignedDivide', TestCases.DIV)
  runTestCases('signedDivide', TestCases.SDIV)
  runTestCases('unsignedModulo', TestCases.MOD)
  runTestCases('signedModulo', TestCases.SMOD)
  runTestCases('exponentiate', TestCases.EXP)
  runTestCases('extendSign', invert(TestCases.SIGNEXTEND))
  runTestCases('unsignedLessThan', TestCases.LT)
  runTestCases('signedLessThan', TestCases.SLT)
  runTestCases('unsignedGreaterThan', TestCases.GT)
  runTestCases('signedGreaterThan', TestCases.SGT)
  runTestCases('equals', TestCases.EQ)
  runTestCases('isZero', TestCases.ISZERO)
  runTestCases('and', TestCases.AND)
  runTestCases('or', TestCases.OR)
  runTestCases('xor', TestCases.XOR)
  runTestCases('not', TestCases.NOT)
  runTestCases('getByte', invert(TestCases.BYTE))
  runTestCases('shiftLeft', invert(TestCases.SHL))
  runTestCases('logicalShiftRight', invert(TestCases.SHR))
  runTestCases('arithmeticShiftRight', invert(TestCases.SAR))
})

export function invert (testCases: TestCase[]): TestCase[] {
  return testCases.map(testCase => ({
    ...testCase,
    stack: [...testCase.stack].reverse(),
  }))
}

function runTestCases (method: keyof MachineWord, testCases: TestCase[]) {
  describe('MachineWord.' + method, () => {
    for (const testCase of testCases) {
      it(testCase.title, () => {
        const mws = testCase.stack.map(x => MachineWord.fromHexString(x))
        const [mw, ...args] = mws.reverse()
        let result = (mw as any)[method](...args)
        if (typeof result === 'boolean') {
          result = MachineWord.fromBoolean(result)
        }
        expect(result.toHexString()).to.equal(testCase.expected)
      })
    }
  })
}
