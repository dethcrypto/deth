import { GasCost } from '../../../src/evm/opcodes/gasCosts'
import { expectGas } from '../helpers'

describe('gas costs', () => {
  describe('GasCost.ZERO', () => {
    // STOP tested separately

    xit('RETURN')
    xit('REVERT')
  })

  describe('GasCost.BASE', () => {
    xit('ADDRESS')
    xit('ORIGIN')
    xit('CALLER')
    xit('CALLVALUE')
    xit('CALLDATASIZE')
    xit('CODESIZE')
    xit('GASPRICE')
    xit('COINBASE')
    xit('TIMESTAMP')
    xit('NUMBER')
    xit('DIFFICULTY')
    xit('GASLIMIT')
    xit('RETURNDATASIZE')
    // POP tested separately
    xit('PC')
    // MSIZE tested separately
    xit('GAS')
  })

  describe('GasCost.VERY_LOW', () => {
    testGasPushN(2, 'ADD', GasCost.VERYLOW)
    testGasPushN(2, 'SUB', GasCost.VERYLOW)
    testGasPushN(1, 'NOT', GasCost.VERYLOW)
    testGasPushN(2, 'LT', GasCost.VERYLOW)
    testGasPushN(2, 'GT', GasCost.VERYLOW)
    testGasPushN(2, 'SLT', GasCost.VERYLOW)
    testGasPushN(2, 'SGT', GasCost.VERYLOW)
    testGasPushN(2, 'EQ', GasCost.VERYLOW)
    testGasPushN(1, 'ISZERO', GasCost.VERYLOW)
    testGasPushN(2, 'AND', GasCost.VERYLOW)
    testGasPushN(2, 'OR', GasCost.VERYLOW)
    testGasPushN(2, 'XOR', GasCost.VERYLOW)
    testGasPushN(2, 'BYTE', GasCost.VERYLOW)
    testGasPushN(2, 'SHL', GasCost.VERYLOW)
    testGasPushN(2, 'SHR', GasCost.VERYLOW)
    testGasPushN(2, 'SAR', GasCost.VERYLOW)

    xit('CALLDATALOAD')
    // MLOAD tested separately
    // MSTORE tested separately
    // MSTORE8 tested separately
    // PUSH* tested separately
    // DUP* tested separately
    // SWAP* tested separately
  })

  describe('GasCost.LOW', () => {
    testGasPushN(2, 'MUL', GasCost.LOW)
    testGasPushN(2, 'DIV', GasCost.LOW)
    testGasPushN(2, 'SDIV', GasCost.LOW)
    testGasPushN(2, 'MOD', GasCost.LOW)
    testGasPushN(2, 'SMOD', GasCost.LOW)
    testGasPushN(2, 'SIGNEXTEND', GasCost.LOW)
  })

  describe('GasCost.MEDIUM', () => {
    testGasPushN(3, 'ADDMOD', GasCost.MID)
    testGasPushN(3, 'MULMOD', GasCost.MID)
    // JUMP tested separately
  })

  describe('GasCosts.HIGH', () => {
    // JUMPI tested separately
  })

  xit('other opcodes')
})

function testGasPushN (n: number, opcode: string, expectedGas: number) {
  it(`${opcode} uses ${expectedGas} gas`, () => {
    expectGas(
      'PUSH1 00 '.repeat(n) + opcode,
      GasCost.VERYLOW * n + expectedGas,
    )
  })
}
