import { expect } from 'chai'
import { MachineWord } from '../src/MachineWord'

const MAX = MachineWord.MAX.toHexString()
const ONE = MachineWord.ONE.toHexString()
const ZERO = MachineWord.ZERO.toHexString()
const MINUS_ONE = MachineWord.ZERO.subtract(MachineWord.ONE).toHexString()

const negative = (value: string) => MachineWord.ZERO
  .subtract(MachineWord.fromHexString(value))
  .toHexString()

describe('MachineWord', () => {
  describe('MachineWord.add', () => {
    const testCases = [
      {
        it: 'can preform simple addition',
        a: '1234',
        b: '23456',
        c: '2468a',
      },
      {
        it: 'can add one zero',
        a: '1234',
        b: '0',
        c: '1234',
      },
      {
        it: 'can add two zeroes',
        a: '0',
        b: '0',
        c: '0',
      },
      {
        it: 'handles trivial overflow',
        a: MAX,
        b: '12345',
        c: '12344',
      },
      {
        it: 'handles more complex overflow',
        a: 'ef'.padEnd(64, '0'),
        b: '30'.padEnd(64, '0'),
        c: '1f'.padEnd(64, '0'),
      },
    ]

    testCases.forEach(testCase => {
      it(testCase.it, () => {
        const a = MachineWord.fromHexString(testCase.a)
        const b = MachineWord.fromHexString(testCase.b)
        const result = a.add(b)
        expect(result.toHexString()).to.equal(testCase.c.padStart(64, '0'))
      })
    })
  })

  describe('MachineWord.subtract', () => {
    const testCases = [
      {
        it: 'can subtract one',
        a: '60000',
        b: ONE,
        c: '5ffff',
      },
      {
        it: 'can subtract minus one',
        a: '32',
        b: MINUS_ONE,
        c: '33',
      },
      {
        it: 'can preform simple subtraction',
        a: '60000',
        b: '54321',
        c: '0bcdf',
      },
      {
        it: 'can subtract one zero',
        a: '1234',
        b: ZERO,
        c: '1234',
      },
      {
        it: 'can subtract two zeroes',
        a: ZERO,
        b: ZERO,
        c: ZERO,
      },
      {
        it: 'handles trivial overflow',
        a: ZERO,
        b: 'fedcba9',
        c: '0123457'.padStart(64, 'f'),
      },
      {
        it: 'handles more complex overflow',
        a: '30'.padEnd(64, '0'),
        b: 'ef'.padEnd(64, '0'),
        c: '41'.padEnd(64, '0'),
      },
    ]

    testCases.forEach(testCase => {
      it(testCase.it, () => {
        const a = MachineWord.fromHexString(testCase.a)
        const b = MachineWord.fromHexString(testCase.b)
        const result = a.subtract(b)
        expect(result.toHexString()).to.equal(testCase.c.padStart(64, '0'))
      })
    })
  })

  describe('MachineWord.multiply', () => {
    const testCases = [
      {
        it: 'can multiply by zero',
        a: '1234',
        b: ZERO,
        c: ZERO,
      },
      {
        it: 'can multiply by one',
        a: '1234',
        b: ONE,
        c: '1234',
      },
      {
        it: 'can multiply a positive number by minus one',
        a: '1234',
        b: negative('1'),
        c: negative('1234'),
      },
      {
        it: 'can multiply a negative number by minus one',
        a: negative('1234'),
        b: negative('1'),
        c: '1234',
      },
      {
        it: 'can do a simple multiplication',
        a: '12',
        b: '34',
        c: '3a8',
      },
      {
        it: 'handles overflow by applying modulo',
        a: '0ff'.padEnd(64, '0'),
        b: '100',
        c: 'f'.padEnd(64, '0'),
      },
    ]

    testCases.forEach(testCase => {
      it(testCase.it, () => {
        const a = MachineWord.fromHexString(testCase.a)
        const b = MachineWord.fromHexString(testCase.b)
        const result = a.multiply(b)
        expect(result.toHexString()).to.equal(testCase.c.padStart(64, '0'))
      })
    })
  })
})
