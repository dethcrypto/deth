import { expect } from 'chai'
import { MachineWord } from '../src/MachineWord'

const ONE = MachineWord.ONE.toHexString()
const ZERO = MachineWord.ZERO.toHexString()
const MINUS_ONE = MachineWord.MAX.toHexString()

const negative = (value: string) => MachineWord.ZERO
  .subtract(MachineWord.fromHexString(value))
  .toHexString()

describe('MachineWord', () => {
  testBinOp('add', (it) => {
    it('can preform simple addition', {
      a: '1234',
      b: '23456',
      c: '2468a',
    })

    it('can add one zero', {
      a: '1234',
      b: '0',
      c: '1234',
    })

    it('can add two zeroes', {
      a: '0',
      b: '0',
      c: '0',
    })

    it('can add negative numbers', {
      a: MINUS_ONE,
      b: '12345',
      c: '12344',
    })

    it('handles overflow', {
      a: 'ef'.padEnd(64, '0'),
      b: '30'.padEnd(64, '0'),
      c: '1f'.padEnd(64, '0'),
    })
  })

  testBinOp('subtract', (it) => {
    it('can subtract one', {
      a: '60000',
      b: ONE,
      c: '5ffff',
    })

    it('can subtract minus one', {
      a: '32',
      b: MINUS_ONE,
      c: '33',
    })

    it('can preform simple subtraction', {
      a: '60000',
      b: '54321',
      c: '0bcdf',
    })

    it('can subtract one zero', {
      a: '1234',
      b: ZERO,
      c: '1234',
    })

    it('can subtract two zeroes', {
      a: ZERO,
      b: ZERO,
      c: ZERO,
    })

    it('handles trivial overflow', {
      a: ZERO,
      b: 'fedcba9',
      c: '0123457'.padStart(64, 'f'),
    })

    it('handles more complex overflow', {
      a: '30'.padEnd(64, '0'),
      b: 'ef'.padEnd(64, '0'),
      c: '41'.padEnd(64, '0'),
    })
  })

  testBinOp('multiply', (it) => {
    it('can multiply by zero', {
      a: '1234',
      b: ZERO,
      c: ZERO,
    })

    it('can multiply by one', {
      a: '1234',
      b: ONE,
      c: '1234',
    })

    it('can multiply a positive number by minus one', {
      a: '1234',
      b: negative('1'),
      c: negative('1234'),
    })

    it('can multiply a negative number by minus one', {
      a: negative('1234'),
      b: negative('1'),
      c: '1234',
    })

    it('can do a simple multiplication', {
      a: '12',
      b: '34',
      c: '3a8',
    })

    it('handles overflow by applying modulo', {
      a: '0ff'.padEnd(64, '0'),
      b: '100',
      c: 'f'.padEnd(64, '0'),
    })
  })

  testBinOp('unsignedDivide', (it) => {
    it('can do a simple division', {
      a: '1234',
      b: '2',
      c: '91a',
    })

    it('can do an integer division', {
      a: '100',
      b: '3',
      c: '55',
    })

    it('can divide by a larger number', {
      a: '5',
      b: '6',
      c: ZERO,
    })

    it('can divide by one', {
      a: '1234',
      b: '1',
      c: '1234',
    })

    it('can divide equal number', {
      a: '1234',
      b: '1234',
      c: '1',
    })

    it('can handle large numbers', {
      a: MINUS_ONE,
      b: '2',
      c: '7'.padEnd(64, 'f'),
    })
  })

  testBinOp('signedDivide', (it) => {
    it('can do a division of positive / negative', {
      a: '1234',
      b: negative('2'),
      c: negative('91a'),
    })

    it('can do a division of negative / positive', {
      a: negative('1234'),
      b: '2',
      c: negative('91a'),
    })

    it('can do a division of negative / negative', {
      a: negative('1234'),
      b: negative('2'),
      c: '91a',
    })

    it('can divide by an absolutely larger number', {
      a: '6',
      b: negative('10'),
      c: '0',
    })

    it('interprets large numbers as negative', {
      a: MINUS_ONE,
      b: '2',
      c: ZERO,
    })
  })
})

type MachineWordBinOp =
  | 'add'
  | 'subtract'
  | 'multiply'
  | 'unsignedDivide'
  | 'signedDivide'

interface BinOpTestCase {
  a: string,
  b: string,
  c: string,
}

type BinOpCallback = (it: (title: string, testCase: BinOpTestCase) => void) => void

function testBinOp (method: MachineWordBinOp, callback: BinOpCallback) {
  describe('MachineWord.' + method, () => {
    callback((title, testCase) => {
      it(title, () => {
        const a = MachineWord.fromHexString(testCase.a)
        const b = MachineWord.fromHexString(testCase.b)
        const result = a[method](b)
        expect(result.toHexString()).to.equal(testCase.c.padStart(64, '0'))
      })
    })
  })
}
