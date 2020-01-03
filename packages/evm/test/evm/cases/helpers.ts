import { MachineWord } from "../../../src/MachineWord"

const HEX_REGEX = /^0x[\da-f]*$/

export const Int256 = {
  FALSE: '0'.repeat(64),
  TRUE: '1'.padStart(64, '0'),
  MAX_UNSIGNED: 'f'.repeat(64),
  MAX_SIGNED: '7' + 'f'.repeat(63),
  MIN_SIGNED: '8' + '0'.repeat(63),
  of (value: number | string) {
    if (typeof value === 'string') {
      if (!HEX_REGEX.test(value)) {
        throw new TypeError('Invalid Int256')
      }
      return value.substring(2).padStart(64, '0')
    } else {
      if (!Number.isSafeInteger(value)) {
        throw new TypeError('Invalid Int256')
      }
      return value >= 0
        ? value.toString(16).padStart(64, '0')
        : negative((-value).toString(16))
    }
  }
}

function negative (value: string) {
  return MachineWord.ZERO
    .subtract(MachineWord.fromHexString(value))
    .toHexString()
}

export interface TestCase {
  title: string,
  stack: string[],
  expected: string,
}

export interface GethTestCase {
  X: string,
  Y: string,
  Expected: string,
}

export function importGeth (testCases: GethTestCase[]): TestCase[] {
  return testCases.map((testCase, i) => ({
    title: `geth #${i + 1}`,
    stack: [
      testCase.X,
      testCase.Y
    ],
    expected: testCase.Expected,
  }))
}

export function importParity (testCases: Omit<TestCase, 'title'>[]): TestCase[] {
  return testCases.map((testCase, i) => ({
    title: `parity #${i + 1}`,
    ...testCase,
  }))
}
