import { expect } from 'chai'
import { MachineWord } from '../../src/MachineWord'

const negative = (value: string) => MachineWord.ZERO
  .subtract(MachineWord.fromHexString(value))
  .toHexString()

describe('MachineWord - parity', () => {
  testBinOp('add', [
    // https://github.com/paritytech/parity-ethereum/blob/dabfa2c6/ethcore/evm/src/tests.rs#L30
    {
      a: negative('1'),
      b: negative('1'),
      c: negative('2'),
    }
  ])

  testBinOp('subtract', [
    // https://github.com/paritytech/parity-ethereum/blob/dabfa2c6/ethcore/evm/src/tests.rs#L452
    {
      a: '12365124623',
      b: '654321',
      c: '12364ad0302',
    },
  ])

  testBinOp('multiply', [
    // https://github.com/paritytech/parity-ethereum/blob/dabfa2c6/ethcore/evm/src/tests.rs#L434
    {
      a: '12365124623',
      b: '654321',
      c: '734349397b853383',
    },
  ])

  testBinOp('unsignedDivide', [
    // https://github.com/paritytech/parity-ethereum/blob/dabfa2c6/ethcore/evm/src/tests.rs#L470
    {
      a: '12365124623',
      b: '654321',
      c: '2e0ac',
    },
  ])

  testBinOp('signedDivide', [
    // https://github.com/paritytech/parity-ethereum/blob/dabfa2c6/ethcore/evm/src/tests.rs#L557
    {
      a: '12365124623',
      b: '654322',
      c: '2e0ac',
    },
    // https://github.com/paritytech/parity-ethereum/blob/dabfa2c6/ethcore/evm/src/tests.rs#L558
    {
      a: '12365124623',
      b: '0',
      c: '0',
    },
  ])

  testBinOp('unsignedModulo', [
    // https://github.com/paritytech/parity-ethereum/blob/dabfa2c6/ethcore/evm/src/tests.rs#L519
    {
      a: '12365124623',
      b: '654322',
      c: '76b4b',
    },
    // https://github.com/paritytech/parity-ethereum/blob/dabfa2c6/ethcore/evm/src/tests.rs#L520
    {
      a: '12365124623',
      b: '0',
      c: '0',
    },
  ])
})

interface TestCase {
  a: string,
  b: string,
  c: string,
}

function testBinOp (method: keyof MachineWord, testCases: TestCase[]) {
  describe('MachineWord.' + method, () => {
    testCases.forEach((testCase, index) => {
      it(`${method} test #${index + 1}`, () => {
        const a = MachineWord.fromHexString(testCase.a)
        const b = MachineWord.fromHexString(testCase.b)
        const result = (a as any)[method](b)
        expect(result.toHexString()).to.equal(testCase.c.padStart(64, '0'))
      })
    })
  })
}
