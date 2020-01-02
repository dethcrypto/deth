import testCasesADD from './geth/add.json'
import testCasesSUB from './geth/sub.json'
import testCasesMUL from './geth/mul.json'
import testCasesDIV from './geth/div.json'
import testCasesSDIV from './geth/sdiv.json'
import testCasesMOD from './geth/mod.json'
import testCasesSMOD from './geth/smod.json'
import testCasesEXP from './geth/exp.json'
import testCasesSIGNEXT from './geth/signext.json'
import testCasesLT from './geth/lt.json'
import testCasesSLT from './geth/slt.json'
import testCasesGT from './geth/gt.json'
import testCasesSGT from './geth/sgt.json'
import testCasesEQ from './geth/eq.json'
import testCasesAND from './geth/and.json'
import testCasesOR from './geth/or.json'
import testCasesXOR from './geth/xor.json'
import testCasesBYTE from './geth/byte.json'
import testCasesSHL from './geth/shl.json'
import testCasesSHR from './geth/shr.json'
import testCasesSAR from './geth/sar.json'

import { expect, AssertionError } from 'chai'
import { MachineWord } from '../../src/MachineWord'

describe('MachineWord - geth', () => {
  testMW('add', testCasesADD)
  testMW('subtract', flip(testCasesSUB))
  testMW('multiply', flip(testCasesMUL))
  testMW('unsignedDivide', flip(testCasesDIV))
  testMW('signedDivide', flip(testCasesSDIV))
  testMW('unsignedModulo', flip(testCasesMOD))
  testMW('signedModulo', flip(testCasesSMOD))
  testMW('exponentiate', flip(testCasesEXP))
  testMW('extendSign', testCasesSIGNEXT)
  testBoolean('unsignedLessThan', flip(testCasesLT))
  testBoolean('signedLessThan', flip(testCasesSLT))
  testBoolean('unsignedGreaterThan', flip(testCasesGT))
  testBoolean('signedGreaterThan', flip(testCasesSGT))
  // I couldn't find geth tests for ISZERO
  testBoolean('equals', testCasesEQ)
  testMW('and', testCasesAND)
  testMW('or', flip(testCasesOR))
  testMW('xor', testCasesXOR)
  // I couldn't find geth tests for NOT
  testMW('getByte', testCasesBYTE)
  testMW('shiftLeft', testCasesSHL)
  testMW('logicalShiftRight', testCasesSHR)
  testMW('arithmeticShiftRight', testCasesSAR)
  // I couldn't find geth tests for SHA3
})

interface TestCase {
  X: string,
  Y: string,
  Expected: string,
}

function flip (testCases: TestCase[]) {
  return testCases.map(testCase => ({
    X: testCase.Y,
    Y: testCase.X,
    Expected: testCase.Expected
  }))
}

function testBoolean (method: keyof MachineWord, testCases: TestCase[]) {
  function convert (value: boolean) {
    return value
      ? '1'.padStart(64, '0')
      : '0'.repeat(64)
  }
  return testMethod(method, testCases, convert)
}

function testMW (method: keyof MachineWord, testCases: TestCase[]) {
  return testMethod(method, testCases, (x: MachineWord) => x.toHexString())
}

function testMethod (method: keyof MachineWord, testCases: TestCase[], convert: (value: any) => string) {
  describe('MachineWord.' + method, () => {
    for (let i = 0; i < testCases.length; i++) {
      const testCase = testCases[i]
      it(`${method} test #${i + 1}`, () => {
        const x = MachineWord.fromHexString(testCase.X)
        const y = MachineWord.fromHexString(testCase.Y)
        const result = convert((x as any)[method](y))
        try {
          expect(result).to.equal(testCase.Expected)
        } catch (e) {
          throw new AssertionError(`${method}(${testCase.X}, ${testCase.Y})`, {
            actual: result,
            expected: testCase.Expected,
            showDiff: true,
          })
        }
      })
    }
  })
}
