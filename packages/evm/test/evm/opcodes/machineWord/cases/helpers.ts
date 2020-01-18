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
      testCase.Y,
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
