import { expect } from 'chai'
import { GasCost } from '../../../src/evm/opcodes/gasCosts'
import { executeAssembly } from '../helpers'

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
    xit('MSIZE')
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
    xit('MLOAD')
    xit('MSTORE')
    xit('MSTORE8')

    // PUSH* tested separately
    // DUP* tested separately

    describe('SWAP*', () => {
      for (let i = 1; i <= 16; i++) {
        testGasPushN(i + 1, 'SWAP' + i, GasCost.VERYLOW)
      }
    })
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

    xit('JUMP')
  })

  describe('GasCosts.HIGH', () => {
    xit('JUMPI')
  })

  xit('other opcodes')
})

function testGasPushN (n: number, opcode: string, expectedGas: number) {
  testGas(
    `${opcode} uses ${expectedGas} gas`,
    'PUSH1 00 '.repeat(n) + opcode,
    GasCost.VERYLOW * n + expectedGas,
  )
}

function testGas (title: string, assembly: string, expectedGas: number) {
  it(title, () => {
    const result = executeAssembly(assembly)
    expect(result.error).to.equal(undefined)
    expect(result.gasUsed).to.equal(expectedGas)
  })
}
