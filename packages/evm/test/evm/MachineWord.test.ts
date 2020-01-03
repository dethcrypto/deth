import { expect } from 'chai'
import { MachineWord } from '../../src/evm/MachineWord'
import { TestCases } from './cases'
import { TestCase } from './cases/helpers'

describe('MachineWord', () => {
  runTestCases('add', TestCases.ADD)
  runTestCases('mul', TestCases.MUL)
  runTestCases('sub', TestCases.SUB)
  runTestCases('div', TestCases.DIV)
  runTestCases('sdiv', TestCases.SDIV)
  runTestCases('mod', TestCases.MOD)
  runTestCases('smod', TestCases.SMOD)
  runTestCases('exp', TestCases.EXP)
  runTestCases('signextend', invert(TestCases.SIGNEXTEND))
  runTestCases('lt', TestCases.LT)
  runTestCases('slt', TestCases.SLT)
  runTestCases('gt', TestCases.GT)
  runTestCases('sgt', TestCases.SGT)
  runTestCases('eq', TestCases.EQ)
  runTestCases('iszero', TestCases.ISZERO)
  runTestCases('and', TestCases.AND)
  runTestCases('or', TestCases.OR)
  runTestCases('xor', TestCases.XOR)
  runTestCases('not', TestCases.NOT)
  runTestCases('byte', invert(TestCases.BYTE))
  runTestCases('shl', invert(TestCases.SHL))
  runTestCases('shr', invert(TestCases.SHR))
  runTestCases('sar', invert(TestCases.SAR))
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
