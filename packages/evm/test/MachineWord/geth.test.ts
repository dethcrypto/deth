import testCasesADD from './geth/add.json'
import testCasesAND from './geth/and.json'
import testCasesBYTE from './geth/byte.json'
import testCasesDIV from './geth/div.json'
import testCasesEQ from './geth/eq.json'
import testCasesEXP from './geth/exp.json'
import testCasesGT from './geth/gt.json'
import testCasesLT from './geth/lt.json'
import testCasesMOD from './geth/mod.json'
import testCasesMUL from './geth/mul.json'
import testCasesOR from './geth/or.json'
import testCasesSAR from './geth/sar.json'
import testCasesSDIV from './geth/sdiv.json'
import testCasesSGT from './geth/sgt.json'
import testCasesSHL from './geth/shl.json'
import testCasesSHR from './geth/shr.json'
import testCasesSIGNEXT from './geth/signext.json'
import testCasesSLT from './geth/slt.json'
import testCasesSMOD from './geth/smod.json'
import testCasesSUB from './geth/sub.json'
import testCasesXOR from './geth/xor.json'

import { expect, AssertionError } from 'chai'
import { MachineWord } from '../../src/MachineWord'

describe('MachineWord - geth', () => {
  testMW('add', testCasesADD)
  testMW('and', testCasesAND)
  testMW('getByte', testCasesBYTE)
  testMW('unsignedDivide', flip(testCasesDIV))
  testBoolean('equals', testCasesEQ)
  testMW('exponentiate', flip(testCasesEXP))
  testBoolean('unsignedGreaterThan', flip(testCasesGT))
  testBoolean('unsignedLessThan', flip(testCasesLT))
  testMW('unsignedModulo', flip(testCasesMOD))
  testMW('multiply', flip(testCasesMUL))
  testMW('or', flip(testCasesOR))
  testMW('arithmeticShiftRight', testCasesSAR)
  testMW('signedDivide', flip(testCasesSDIV))
  testBoolean('signedGreaterThan', flip(testCasesSGT))
  testBoolean('signedGreaterThan', flip(testCasesSGT))
  testMW('shiftLeft', testCasesSHL)
  testMW('logicalShiftRight', testCasesSHR)
  testMW('extendSign', testCasesSIGNEXT)
  testBoolean('signedLessThan', flip(testCasesSLT))
  testMW('signedModulo', flip(testCasesSMOD))
  testMW('subtract', flip(testCasesSUB))
  testMW('xor', testCasesXOR)
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
      it(`${method} test #${i}`, () => {
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
