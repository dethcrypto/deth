import { expect } from 'chai'
import { executeAssembly, ADDRESS_ZERO } from './helpers'
import { InvalidOpcode } from '../../src/evm/errors'
import { Bytes32 } from '../../src/evm/Bytes32'
import { State } from '../../src/evm/State'

describe('When an exception occurs', () => {
  it('all gas is used', () => {
    const result = executeAssembly('INVALID', { gasLimit: 1_000_000 })

    expect(result.error).to.be.instanceOf(InvalidOpcode)
    expect(result.gasUsed).to.equal(1_000_000)
  })

  it('state changes are reverted', () => {
    const account = ADDRESS_ZERO
    const state = new State()
    state.setStorage(account, Bytes32.ZERO, Bytes32.ONE)

    const assembly = `
      PUSH1 02
      PUSH1 00
      SSTORE
      PUSH1 03
      PUSH1 01
      SSTORE
      INVALID
    `
    const result = executeAssembly(assembly, { account, state })

    expect(result.error).to.be.instanceOf(InvalidOpcode)
    const storageAt0 = result.state.getStorage(account, Bytes32.ZERO)
    const storageAt1 = result.state.getStorage(account, Bytes32.ONE)
    expect(storageAt0.equals(Bytes32.ONE)).to.equal(true)
    expect(storageAt1.equals(Bytes32.ZERO)).to.equal(true)
  })
})
