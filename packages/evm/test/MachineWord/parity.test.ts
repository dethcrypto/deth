import { expect } from 'chai'
import { MachineWord } from '../../src/MachineWord'

const negative = (value: string) => MachineWord.ZERO
  .subtract(MachineWord.fromHexString(value))
  .toHexString()

describe.only('MachineWord - parity', () => {
  testBinOp('add', [
    // https://github.com/paritytech/parity-ethereum/blob/dabfa2c6/ethcore/evm/src/tests.rs#L51
    {
      value: negative('1'),
      other: negative('1'),
      result: negative('2'),
    }
  ])

  testBinOp('subtract', [
    // https://github.com/paritytech/parity-ethereum/blob/dabfa2c6/ethcore/evm/src/tests.rs#L465
    {
      value: '12365124623',
      other: '654321',
      result: '12364ad0302',
    },
  ])

  testBinOp('multiply', [
    // https://github.com/paritytech/parity-ethereum/blob/dabfa2c6/ethcore/evm/src/tests.rs#L447
    {
      value: '12365124623',
      other: '654321',
      result: '734349397b853383',
    },
  ])

  testBinOp('unsignedDivide', [
    // https://github.com/paritytech/parity-ethereum/blob/dabfa2c6/ethcore/evm/src/tests.rs#L483
    {
      value: '12365124623',
      other: '654321',
      result: '2e0ac',
    },
  ])

  testBinOp('signedDivide', [
    // https://github.com/paritytech/parity-ethereum/blob/dabfa2c6/ethcore/evm/src/tests.rs#L557
    {
      value: '12365124623',
      other: '654322',
      result: '2e0ac',
    },
    // https://github.com/paritytech/parity-ethereum/blob/dabfa2c6/ethcore/evm/src/tests.rs#L558
    {
      value: '12365124623',
      other: '0',
      result: '0',
    },
  ])

  testBinOp('unsignedModulo', [
    // https://github.com/paritytech/parity-ethereum/blob/dabfa2c6/ethcore/evm/src/tests.rs#L519
    {
      value: '12365124623',
      other: '654322',
      result: '76b4b',
    },
    // https://github.com/paritytech/parity-ethereum/blob/dabfa2c6/ethcore/evm/src/tests.rs#L520
    {
      value: '12365124623',
      other: '0',
      result: '0',
    },
  ])

  testBinOp('signedModulo', [
    // https://github.com/paritytech/parity-ethereum/blob/dabfa2c6/ethcore/evm/src/tests.rs#L538
    {
      value: '12365124623',
      other: '654322',
      result: '76b4b',
    },
    // https://github.com/paritytech/parity-ethereum/blob/dabfa2c6/ethcore/evm/src/tests.rs#L539
    {
      value: '12365124623',
      other: '0',
      result: '0',
    },
  ])

  testBinOp('exponentiate', [
    // https://github.com/paritytech/parity-ethereum/blob/dabfa2c6/ethcore/evm/src/tests.rs#L576
    {
      value: '12365124623',
      other: '16',
      result: '90fd23767b60204c3d6fc8aec9e70a42a3f127140879c133a20129a597ed0c59',
    },
    // https://github.com/paritytech/parity-ethereum/blob/dabfa2c6/ethcore/evm/src/tests.rs#L577
    {
      value: '12365124623',
      other: '1',
      result: '12365124623',
    },
    // https://github.com/paritytech/parity-ethereum/blob/dabfa2c6/ethcore/evm/src/tests.rs#L578
    {
      value: '12365124623',
      other: '0',
      result: '1',
    },
  ])

  testBinOp('extendSign', [
    // https://github.com/paritytech/parity-ethereum/blob/dabfa2c6/ethcore/evm/src/tests.rs#L701
    {
      value: 'fff',
      other: '2',
      result: 'fff',
    },
    // https://github.com/paritytech/parity-ethereum/blob/dabfa2c6/ethcore/evm/src/tests.rs#L702
    {
      value: 'ff',
      other: '20',
      result: 'ff',
    },
  ])

  testBinOp('unsignedLessThan', [
    // https://github.com/paritytech/parity-ethereum/blob/dabfa2c6/ethcore/evm/src/tests.rs#L596
    {
      value: '12365124623',
      other: '16',
      result: false,
    },
  ])

  testBinOp('signedLessThan', [
    // https://github.com/paritytech/parity-ethereum/blob/dabfa2c6/ethcore/evm/src/tests.rs#L617
    {
      value: '10',
      other: negative('10'),
      result: false,
    },
    // https://github.com/paritytech/parity-ethereum/blob/dabfa2c6/ethcore/evm/src/tests.rs#L619
    {
      value: negative('10'),
      other: '10',
      result: true,
    },
  ])

  testBinOp('unsignedGreaterThan', [
    // https://github.com/paritytech/parity-ethereum/blob/dabfa2c6/ethcore/evm/src/tests.rs#L597
    {
      value: '12365124623',
      other: '16',
      result: true,
    },
  ])

  testBinOp('signedGreaterThan', [
    // https://github.com/paritytech/parity-ethereum/blob/dabfa2c6/ethcore/evm/src/tests.rs#L618
    {
      value: '10',
      other: negative('10'),
      result: true,
    },
    // https://github.com/paritytech/parity-ethereum/blob/dabfa2c6/ethcore/evm/src/tests.rs#L620
    {
      value: negative('10'),
      other: '10',
      result: false,
    },
  ])

  testBinOp('equals', [
    // https://github.com/paritytech/parity-ethereum/blob/dabfa2c6/ethcore/evm/src/tests.rs#L598
    {
      value: '12365124623',
      other: '16',
      result: false,
    },
    // https://github.com/paritytech/parity-ethereum/blob/dabfa2c6/ethcore/evm/src/tests.rs#L599
    {
      value: '1523541235',
      other: '1523541235',
      result: true,
    },
  ])

  /*
    Storage:
      0: and(0ff0, ff)
      1: or(0ff0, ff)
      2: xor(0ff0, ff)
      3: izZero(0)
      4: izZero(not(0))
      5: not(0)
   */

  testUnaryOp('isZero', [
    // https://github.com/paritytech/parity-ethereum/blob/dabfa2c6/ethcore/evm/src/tests.rs#L641
    {
      value: '0',
      result: true,
    },
    // https://github.com/paritytech/parity-ethereum/blob/dabfa2c6/ethcore/evm/src/tests.rs#L642
    {
      value: negative('1'),
      result: false,
    },
  ])

  testBinOp('and', [
    // https://github.com/paritytech/parity-ethereum/blob/dabfa2c6/ethcore/evm/src/tests.rs#L638
    {
      value: '0ff0',
      other: '00ff',
      result: '00f0',
    },
  ])

  testBinOp('or', [
    // https://github.com/paritytech/parity-ethereum/blob/dabfa2c6/ethcore/evm/src/tests.rs#L639
    {
      value: '0ff0',
      other: '00ff',
      result: '0fff',
    },
  ])

  testBinOp('xor', [
    // https://github.com/paritytech/parity-ethereum/blob/dabfa2c6/ethcore/evm/src/tests.rs#L640
    {
      value: '0ff0',
      other: '00ff',
      result: '0f0f',
    },
  ])

  testUnaryOp('not', [
    // https://github.com/paritytech/parity-ethereum/blob/dabfa2c6/ethcore/evm/src/tests.rs#L643
    {
      value: '0',
      result: negative('1'),
    },
  ])

  testBinOp('getByte', [
    // https://github.com/paritytech/parity-ethereum/blob/dabfa2c6/ethcore/evm/src/tests.rs#L682
    {
      value: 'ffff',
      other: 'f0',
      result: '00',
    },
    // https://github.com/paritytech/parity-ethereum/blob/dabfa2c6/ethcore/evm/src/tests.rs#L683
    {
      value: 'fff',
      other: '1f',
      result: 'ff',
    },
  ])

  // https://github.com/paritytech/parity-ethereum/blob/dabfa2c6/ethcore/evm/src/tests.rs#L858
  testBinOp('shiftLeft', [
    {
      value: '1',
      other: '0',
      result: '1',
    },
    {
      value: '1',
      other: '1',
      result: '2',
    },
    {
      value: '1',
      other: 'ff',
      result: '8000000000000000000000000000000000000000000000000000000000000000',
    },
    {
      value: '1',
      other: '100',
      result: '0',
    },
    {
      value: '1',
      other: '101',
      result: '0',
    },
    {
      value: negative('1'),
      other: '0',
      result: negative('1'),
    },
    {
      value: negative('1'),
      other: '1',
      result: 'fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe',
    },
    {
      value: negative('1'),
      other: 'ff',
      result: '8000000000000000000000000000000000000000000000000000000000000000',
    },
    {
      value: negative('1'),
      other: '100',
      result: '0',
    },
    {
      value: '0',
      other: '1',
      result: '0',
    },
    {
      value: '7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
      other: '1',
      result: 'fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe',
    },
  ])

  // https://github.com/paritytech/parity-ethereum/blob/dabfa2c6/ethcore/evm/src/tests.rs#L928
  testBinOp('logicalShiftRight', [
    {
      value: "0000000000000000000000000000000000000000000000000000000000000001",
      other: "00",
      result: "0000000000000000000000000000000000000000000000000000000000000001",
    },
    {
      value: "0000000000000000000000000000000000000000000000000000000000000001",
      other: "01",
      result: "0000000000000000000000000000000000000000000000000000000000000000",
    },
    {
      value: "8000000000000000000000000000000000000000000000000000000000000000",
      other: "01",
      result: "4000000000000000000000000000000000000000000000000000000000000000",
    },
    {
      value: "8000000000000000000000000000000000000000000000000000000000000000",
      other: "ff",
      result: "0000000000000000000000000000000000000000000000000000000000000001",
    },
    {
      value: "8000000000000000000000000000000000000000000000000000000000000000",
      other: "0100",
      result: "0000000000000000000000000000000000000000000000000000000000000000",
    },
    {
      value: "8000000000000000000000000000000000000000000000000000000000000000",
      other: "0101",
      result: "0000000000000000000000000000000000000000000000000000000000000000",
    },
    {
      value: "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
      other: "00",
      result: "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
    },
    {
      value: "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
      other: "01",
      result: "7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
    },
    {
      value: "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
      other: "ff",
      result: "0000000000000000000000000000000000000000000000000000000000000001",
    },
    {
      value: "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
      other: "0100",
      result: "0000000000000000000000000000000000000000000000000000000000000000",
    },
    {
      value: "0000000000000000000000000000000000000000000000000000000000000000",
      other: "01",
      result: "0000000000000000000000000000000000000000000000000000000000000000",
    },
  ])

  // https://github.com/paritytech/parity-ethereum/blob/dabfa2c6/ethcore/evm/src/tests.rs#L998
  testBinOp('arithmeticShiftRight', [
    {
      value: "0000000000000000000000000000000000000000000000000000000000000001",
      other: "00",
      result: "0000000000000000000000000000000000000000000000000000000000000001",
    },
    {
      value: "0000000000000000000000000000000000000000000000000000000000000001",
      other: "01",
      result: "0000000000000000000000000000000000000000000000000000000000000000",
    },
    {
      value: "8000000000000000000000000000000000000000000000000000000000000000",
      other: "01",
      result: "c000000000000000000000000000000000000000000000000000000000000000",
    },
    {
      value: "8000000000000000000000000000000000000000000000000000000000000000",
      other: "ff",
      result: "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
    },
    {
      value: "8000000000000000000000000000000000000000000000000000000000000000",
      other: "0100",
      result: "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
    },
    {
      value: "8000000000000000000000000000000000000000000000000000000000000000",
      other: "0101",
      result: "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
    },
    {
      value: "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
      other: "00",
      result: "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
    },
    {
      value: "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
      other: "01",
      result: "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
    },
    {
      value: "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
      other: "ff",
      result: "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
    },
    {
      value: "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
      other: "0100",
      result: "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
    },
    {
      value: "0000000000000000000000000000000000000000000000000000000000000000",
      other: "01",
      result: "0000000000000000000000000000000000000000000000000000000000000000",
    },
    {
      value: "4000000000000000000000000000000000000000000000000000000000000000",
      other: "fe",
      result: "0000000000000000000000000000000000000000000000000000000000000001",
    },
    {
      value: "7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
      other: "f8",
      result: "000000000000000000000000000000000000000000000000000000000000007f",
    },
    {
      value: "7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
      other: "fe",
      result: "0000000000000000000000000000000000000000000000000000000000000001",
    },
    {
      value: "7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
      other: "ff",
      result: "0000000000000000000000000000000000000000000000000000000000000000",
    },
    {
      value: "7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
      other: "0100",
      result: "0000000000000000000000000000000000000000000000000000000000000000",
    },
  ])
})

interface UnaryTestCase {
  value: string,
  result: string | boolean,
}

interface BinaryTestCase {
  value: string,
  other: string,
  result: string | boolean,
}

function testUnaryOp (method: keyof MachineWord, testCases: UnaryTestCase[]) {
  describe('MachineWord.' + method, () => {
    testCases.forEach((testCase, index) => {
      it(`${method} test #${index + 1}`, () => {
        const a = MachineWord.fromHexString(testCase.value)
        const result = (a as any)[method]()
        if (result instanceof MachineWord && typeof testCase.result === 'string') {
          expect(result.toHexString()).to.equal(testCase.result.padStart(64, '0'))
        } else if (typeof result === 'boolean' && typeof testCase.result === 'boolean') {
          expect(result).to.equal(testCase.result)
        } else {
          throw new Error('Invalid result!')
        }
      })
    })
  })
}


function testBinOp (method: keyof MachineWord, testCases: BinaryTestCase[]) {
  describe('MachineWord.' + method, () => {
    testCases.forEach((testCase, index) => {
      it(`${method} test #${index + 1}`, () => {
        const a = MachineWord.fromHexString(testCase.value)
        const b = MachineWord.fromHexString(testCase.other)
        const result = (a as any)[method](b)
        if (result instanceof MachineWord && typeof testCase.result === 'string') {
          expect(result.toHexString()).to.equal(testCase.result.padStart(64, '0'))
        } else if (typeof result === 'boolean' && typeof testCase.result === 'boolean') {
          expect(result).to.equal(testCase.result)
        } else {
          throw new Error('Invalid result!')
        }
      })
    })
  })
}
