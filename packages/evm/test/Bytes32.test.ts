import { expect } from 'chai'
import { Bytes32 } from '../src/Bytes32'
import { TestCases } from './opcodes/bytes32/cases'
import { TestCase } from './opcodes/bytes32/cases/helpers'
import { Bytes } from '../src/Bytes'

describe('Bytes32', () => {
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

  describe('to and from number', () => {
    it('fromNumber works for positive numbers', () => {
      const a = Bytes32.fromNumber(42)
      const b = Bytes32.fromHex('2a')
      expect(a.eq(b)).to.equal(true)
    })

    it('fromNumber works for zero', () => {
      const a = Bytes32.fromNumber(0)
      const b = Bytes32.ZERO
      expect(a.eq(b)).to.equal(true)
    })

    it('fromNumber works for negative numbers', () => {
      const a = Bytes32.fromNumber(-42)
      const b = Bytes32.ZERO.sub(Bytes32.fromNumber(42))
      expect(a.eq(b)).to.equal(true)
    })

    it('toUnsignedNumber returns a number', () => {
      expect(Bytes32.ONE.toUnsignedNumber()).to.equal(1)
    })

    it('toUnsignedNumber returns Infinity for large numbers', () => {
      expect(Bytes32.MAX.toUnsignedNumber()).to.equal(Infinity)
    })
  })

  describe('to and from hex string', () => {
    it('fromHex works for small numbers', () => {
      const a = Bytes32.fromHex('1')
      const b = Bytes32.ONE
      expect(a.eq(b)).to.equal(true)
    })

    it('fromHex works for large numbers', () => {
      const a = Bytes32.fromHex('f'.repeat(64))
      const b = Bytes32.MAX
      expect(a.eq(b)).to.equal(true)
    })

    it('toHex pads zeroes at the start', () => {
      const result = Bytes32.fromHex('12').toHex()
      expect(result).to.equal('12'.padStart(64, '0'))
    })
  })

  describe('fromBoolean', () => {
    it('creates ZERO from false', () => {
      const result = Bytes32.fromBoolean(false)
      expect(result.iszero()).to.equal(true)
    })

    it('creates ONE from true', () => {
      const result = Bytes32.fromBoolean(true)
      expect(result.eq(Bytes32.ONE)).to.equal(true)
    })
  })

  describe('from and to bytes', () => {
    it('fromBytes works for small numbers', () => {
      const a = Bytes32.fromBytes(Bytes.fromString('1122'))
      const b = Bytes32.fromHex('1122')
      expect(a.eq(b)).to.equal(true)
    })

    it('fromBytes works for large numbers', () => {
      const a = Bytes32.fromBytes(
        Bytes.fromByteIntArray(new Array(32).fill(0xff)),
      )
      const b = Bytes32.MAX
      expect(a.eq(b)).to.equal(true)
    })

    it('toBytes pads zeroes at the start', () => {
      const result = Bytes32.fromBytes(Bytes.fromString('0103')).toBytes()
      expect(result).to.deep.equal(
        Bytes.fromString('0103'.padStart(64, '0')),
      )
    })
  })

  describe('equals', () => {
    it('equals returns true for equal MachineWords', () => {
      const a = Bytes32.fromHex('6').div(Bytes32.fromHex('2'))
      const b = Bytes32.fromHex('3')
      expect(a.eq(b)).to.equal(true)
    })

    it('equals returns false for unequal MachineWords', () => {
      expect(Bytes32.ONE.eq(Bytes32.MAX)).to.equal(false)
    })
  })
})

export function invert (testCases: TestCase[]): TestCase[] {
  return testCases.map(testCase => ({
    ...testCase,
    stack: [...testCase.stack].reverse(),
  }))
}

function runTestCases (method: keyof Bytes32, testCases: TestCase[]) {
  describe('Bytes32.' + method, () => {
    for (const testCase of testCases) {
      it(testCase.title, () => {
        const mws = testCase.stack.map(x => Bytes32.fromHex(x))
        const [mw, ...args] = mws.reverse()
        let result = (mw as any)[method](...args)
        if (typeof result === 'boolean') {
          result = Bytes32.fromBoolean(result)
        }
        expect(result.toHex()).to.equal(testCase.expected)
      })
    }
  })
}
