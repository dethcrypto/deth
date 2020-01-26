import { expect } from 'chai'
import { Bytes32 } from '../../src/evm/Bytes32'
import { TestCases } from './opcodes/bytes32/cases'
import { TestCase } from './opcodes/bytes32/cases/helpers'
import { Byte } from '../../src/evm/Byte'

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
      const b = Bytes32.fromHexString('2a')
      expect(a.equals(b)).to.equal(true)
    })

    it('fromNumber works for zero', () => {
      const a = Bytes32.fromNumber(0)
      const b = Bytes32.ZERO
      expect(a.equals(b)).to.equal(true)
    })

    it('fromNumber works for negative numbers', () => {
      const a = Bytes32.fromNumber(-42)
      const b = Bytes32.ZERO.sub(Bytes32.fromNumber(42))
      expect(a.equals(b)).to.equal(true)
    })

    it('toUnsignedNumber returns a number', () => {
      expect(Bytes32.ONE.toUnsignedNumber()).to.equal(1)
    })

    it('toUnsignedNumber returns Infinity for large numbers', () => {
      expect(Bytes32.MAX.toUnsignedNumber()).to.equal(Infinity)
    })
  })

  describe('to and from hex string', () => {
    it('fromHexString works for small numbers', () => {
      const a = Bytes32.fromHexString('1')
      const b = Bytes32.ONE
      expect(a.equals(b)).to.equal(true)
    })

    it('fromHexString works for large numbers', () => {
      const a = Bytes32.fromHexString('f'.repeat(64))
      const b = Bytes32.MAX
      expect(a.equals(b)).to.equal(true)
    })

    it('toHexString pads zeroes at the start', () => {
      const result = Bytes32.fromHexString('12').toHexString()
      expect(result).to.equal('12'.padStart(64, '0'))
    })
  })

  describe('fromBoolean', () => {
    it('creates ZERO from false', () => {
      const result = Bytes32.fromBoolean(false)
      expect(result.equals(Bytes32.ZERO)).to.equal(true)
    })

    it('creates ONE from true', () => {
      const result = Bytes32.fromBoolean(true)
      expect(result.equals(Bytes32.ONE)).to.equal(true)
    })
  })

  describe('from and to bytes', () => {
    it('fromBytes works for small numbers', () => {
      const a = Bytes32.fromBytes([0x11, 0x22] as Byte[])
      const b = Bytes32.fromHexString('1122')
      expect(a.equals(b)).to.equal(true)
    })

    it('fromBytes works for large numbers', () => {
      const a = Bytes32.fromBytes(new Array(32).fill(0xff))
      const b = Bytes32.MAX
      expect(a.equals(b)).to.equal(true)
    })

    it('toBytes pads zeroes at the start', () => {
      const result = Bytes32.fromBytes([0x1, 0x3] as Byte[]).toBytes()
      expect(result).to.deep.equal(new Array(30).fill(0x00).concat(0x1, 0x3))
    })
  })

  describe('equals', () => {
    it('equals returns true for equal MachineWords', () => {
      const a = Bytes32.fromHexString('6').div(Bytes32.fromHexString('2'))
      const b = Bytes32.fromHexString('3')
      expect(a.equals(b)).to.equal(true)
    })

    it('equals returns false for unequal MachineWords', () => {
      expect(Bytes32.ONE.equals(Bytes32.MAX)).to.equal(false)
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
        const mws = testCase.stack.map(x => Bytes32.fromHexString(x))
        const [mw, ...args] = mws.reverse()
        let result = (mw as any)[method](...args)
        if (typeof result === 'boolean') {
          result = Bytes32.fromBoolean(result)
        }
        expect(result.toHexString()).to.equal(testCase.expected)
      })
    }
  })
}
