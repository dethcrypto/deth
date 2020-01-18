import { expect } from 'chai'
import { MachineWord } from '../../src/evm/MachineWord'
import { TestCases } from './opcodes/machineWord/cases'
import { TestCase } from './opcodes/machineWord/cases/helpers'

describe('MachineWord', () => {
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
      const a = MachineWord.fromNumber(42)
      const b = MachineWord.fromHexString('2a')
      expect(a.equals(b)).to.equal(true)
    })

    it('fromNumber works for zero', () => {
      const a = MachineWord.fromNumber(0)
      const b = MachineWord.ZERO
      expect(a.equals(b)).to.equal(true)
    })

    it('fromNumber works for negative numbers', () => {
      const a = MachineWord.fromNumber(-42)
      const b = MachineWord.ZERO.sub(MachineWord.fromNumber(42))
      expect(a.equals(b)).to.equal(true)
    })

    it('toUnsignedNumber returns a number', () => {
      expect(MachineWord.ONE.toUnsignedNumber()).to.equal(1)
    })

    it('toUnsignedNumber returns Infinity for large numbers', () => {
      expect(MachineWord.MAX.toUnsignedNumber()).to.equal(Infinity)
    })
  })

  describe('to and from hex string', () => {
    it('fromHexString works for small numbers', () => {
      const a = MachineWord.fromHexString('1')
      const b = MachineWord.ONE
      expect(a.equals(b)).to.equal(true)
    })

    it('fromHexString works for large numbers', () => {
      const a = MachineWord.fromHexString('f'.repeat(64))
      const b = MachineWord.MAX
      expect(a.equals(b)).to.equal(true)
    })

    it('toHexString pads zeroes at the start', () => {
      const result = MachineWord.fromHexString('12').toHexString()
      expect(result).to.equal('12'.padStart(64, '0'))
    })
  })

  describe('fromBoolean', () => {
    it('creates ZERO from false', () => {
      const result = MachineWord.fromBoolean(false)
      expect(result.equals(MachineWord.ZERO)).to.equal(true)
    })

    it('creates ONE from true', () => {
      const result = MachineWord.fromBoolean(true)
      expect(result.equals(MachineWord.ONE)).to.equal(true)
    })
  })

  describe('from and to bytes', () => {
    it('fromBytes works for small numbers', () => {
      const a = MachineWord.fromBytes([0x11, 0x22])
      const b = MachineWord.fromHexString('1122')
      expect(a.equals(b)).to.equal(true)
    })

    it('fromBytes works for large numbers', () => {
      const a = MachineWord.fromBytes(new Array(32).fill(0xff))
      const b = MachineWord.MAX
      expect(a.equals(b)).to.equal(true)
    })

    it('toBytes pads zeroes at the start', () => {
      const result = MachineWord.fromBytes([0x1, 0x3]).toBytes()
      expect(result).to.deep.equal(new Array(30).fill(0x00).concat(0x1, 0x3))
    })
  })

  describe('equals', () => {
    it('equals returns true for equal MachineWords', () => {
      const a = MachineWord.fromHexString('6').div(MachineWord.fromHexString('2'))
      const b = MachineWord.fromHexString('3')
      expect(a.equals(b)).to.equal(true)
    })

    it('equals returns false for unequal MachineWords', () => {
      expect(MachineWord.ONE.equals(MachineWord.MAX)).to.equal(false)
    })
  })
})

export function invert (testCases: TestCase[]): TestCase[] {
  return testCases.map(testCase => ({
    ...testCase,
    stack: [...testCase.stack].reverse(),
  }))
}

function runTestCases (method: keyof MachineWord, testCases: TestCase[]) {
  describe('MachineWord.' + method, () => {
    for (const testCase of testCases) {
      it(testCase.title, () => {
        const mws = testCase.stack.map(x => MachineWord.fromHexString(x))
        const [mw, ...args] = mws.reverse()
        let result = (mw as any)[method](...args)
        if (typeof result === 'boolean') {
          result = MachineWord.fromBoolean(result)
        }
        expect(result.toHexString()).to.equal(testCase.expected)
      })
    }
  })
}
