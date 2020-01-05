import { expect } from 'chai'
import { GasCost } from '../../../src/evm/opcodes/gasCosts'
import { executeAssembly } from '../executeAssembly'

describe('gas costs', () => {
  describe('GasCost.ZERO', () => {
    testGas('STOP uses 0 gas', 'STOP', GasCost.ZERO)

    // TODO: RETURN
    // TODO: REVERT
  })

  describe('GasCost.BASE', () => {
    // TODO: ADDRESS
    // TODO: ORIGIN
    // TODO: CALLER
    // TODO: CALLVALUE
    // TODO: CALLDATASIZE
    // TODO: CODESIZE
    // TODO: GASPRICE
    // TODO: COINBASE
    // TODO: TIMESTAMP
    // TODO: NUMBER
    // TODO: DIFFICULTY
    // TODO: GASLIMIT
    // TODO: RETURNDATASIZE
    // TODO: POP
    // TODO: PC
    // TODO: MSIZE
    // TODO: GAS
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

    // TODO: CALLDATALOAD
    // TODO: MLOAD
    // TODO: MSTORE
    // TODO: MSTORE8

    describe('PUSH*', () => {
      for (let i = 1; i <= 32; i++) {
        testPush(i)
      }

      function testPush (n: number) {
        testGas(
          `PUSH${n} uses ${GasCost.VERYLOW} gas`,
          `PUSH${n} ${'00'.repeat(n)}`,
          GasCost.VERYLOW,
        )
      }
    })

    describe('DUP*', () => {
      for (let i = 1; i <= 16; i++) {
        testGasPushN(i, 'DUP' + i, GasCost.VERYLOW)
      }
    })

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

    // TODO: JUMP
  })

  describe('GasCosts.HIGH', () => {
    // TODO: JUMPI
  })

  // TODO: other opcodes
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
    const ctx = executeAssembly(assembly)
    expect(ctx.gasUsed).to.equal(expectedGas)
  })
}
