import { expect } from 'chai'
import { executeAssembly } from '../helpers'
import { Address } from '../../src/Address'
import { State } from '../../src/State'
import { getContractAddress } from '../../src/getContractAddress'
import { Bytes32 } from '../../src/Bytes32'

describe('CREATE opcode', () => {
  const assembly = `
    PUSH1 05 // size of the code
    PUSH1 12 // code offset
    PUSH1 00 // memory offset of the code
    CODECOPY

    PUSH1 05 // size of the code
    PUSH1 00 // memory offset of the code
    PUSH1 69 // value passed
    CREATE

    PUSH1 00
    SSTORE // save the address of the created contract
    STOP

    // code of the contract
    PUSH1 01
    PUSH1 00
    SSTORE // save 1 at address 0 in the storage of the new contract
  `
  const account = 'abcd'.repeat(10) as Address

  it('results in the creation of a new contract', () => {
    const state = new State()
    state.setNonce(account, 42)
    state.setBalance(account, Bytes32.fromNumber(0x100))

    const result = executeAssembly(assembly, { account }, state)

    if (result.type !== 'ExecutionSuccess') {
      expect(result.type).to.equal('ExecutionSuccess')
    } else {
      // increments nonce
      expect(result.state.getNonce(account)).to.equal(43)

      // subtracts balance
      const balance = result.state.getBalance(account)
      expect(balance.eq(Bytes32.fromNumber(0x100 - 0x69))).to.equal(true)

      // returns correct address
      const expectedAddress = getContractAddress(account, 42)
      const actualAddress = result.state
        .getStorage(account, Bytes32.ZERO)
        .toAddress()
      expect(actualAddress).to.equal(expectedAddress)

      // actually runs the contract code
      const stored = result.state.getStorage(actualAddress, Bytes32.ZERO)
      expect(stored.eq(Bytes32.ONE)).to.equal(true)
    }
  })

  it('execution fails an reverts when balance is insufficient', () => {
    const state = new State()
    state.setNonce(account, 42)
    state.setBalance(account, Bytes32.fromNumber(0x68))

    const result = executeAssembly(assembly, { account }, state)

    if (result.type !== 'ExecutionSuccess') {
      expect(result.type).to.equal('ExecutionSuccess')
    } else {
      // does not increment the nonce
      expect(result.state.getNonce(account)).to.equal(42)

      // does not subtract the balance
      const balance = result.state.getBalance(account)
      expect(balance.eq(Bytes32.fromNumber(0x68))).to.equal(true)

      // returns zero
      const returnValue = result.state.getStorage(account, Bytes32.ZERO)
      expect(returnValue).to.equal(Bytes32.ZERO)
    }
  })
})
