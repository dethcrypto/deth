import { expect } from 'chai'
import { State } from '../src/State'
import { Bytes32 } from '../src/Bytes32'
import { Bytes } from '../src/Bytes'
import { ADDRESS_ZERO } from './helpers'

describe('State', () => {
  const address = ADDRESS_ZERO

  it('getBalance returns ZERO by default', () => {
    const state = new State()
    const result = state.getBalance(address)
    expect(result.iszero()).to.equal(true)
  })

  it('getBalance returns previously set value', () => {
    const state = new State()
    state.setBalance(address, Bytes32.ONE)
    const result = state.getBalance(address)
    expect(result.eq(Bytes32.ONE)).to.equal(true)
  })

  it('getNonce returns 0 by default', () => {
    const state = new State()
    const result = state.getNonce(address)
    expect(result).to.equal(0)
  })

  it('getBalance returns previously set value', () => {
    const state = new State()
    state.setNonce(address, 1)
    const result = state.getNonce(address)
    expect(result).to.equal(1)
  })

  it('getStorage returns ZERO by default', () => {
    const state = new State()
    const result = state.getStorage(address, Bytes32.ZERO)
    expect(result.iszero()).to.equal(true)
  })

  it('getStorage returns previously set value', () => {
    const state = new State()
    state.setStorage(address, Bytes32.ZERO, Bytes32.ONE)
    const result = state.getStorage(address, Bytes32.ZERO)
    expect(result.eq(Bytes32.ONE)).to.equal(true)
  })

  it('getCode returns empty by default', () => {
    const state = new State()
    const result = state.getCode(address)
    expect(result).to.deep.equal(Bytes.EMPTY)
  })

  it('getCode returns previously set value', () => {
    const state = new State()
    state.setCode(address, Bytes.fromString('010203'))
    const result = state.getCode(address)
    expect(result).to.deep.equal(Bytes.fromString('010203'))
  })

  it('clone clones the state', () => {
    const state = new State()

    state.setBalance(address, Bytes32.ONE)
    state.setNonce(address, 1)
    state.setStorage(address, Bytes32.ZERO, Bytes32.ONE)
    state.setCode(address, Bytes.fromString('010203'))

    const clone = state.clone()

    clone.setBalance(address, Bytes32.MAX)
    clone.setNonce(address, 2)
    clone.setStorage(address, Bytes32.ZERO, Bytes32.MAX)
    clone.setStorage(address, Bytes32.ONE, Bytes32.ONE)
    clone.setCode(address, Bytes.fromString('0405'))

    expect(state.getBalance(address).eq(Bytes32.ONE)).to.equal(true)
    expect(state.getStorage(address, Bytes32.ZERO).eq(Bytes32.ONE)).to.equal(
      true
    )
    expect(state.getStorage(address, Bytes32.ONE).iszero()).to.equal(true)
    expect(state.getNonce(address)).to.equal(1)
    expect(state.getCode(address)).to.deep.equal(Bytes.fromString('010203'))

    expect(clone.getBalance(address).eq(Bytes32.MAX)).to.equal(true)
    expect(clone.getStorage(address, Bytes32.ZERO).eq(Bytes32.MAX)).to.equal(
      true
    )
    expect(clone.getStorage(address, Bytes32.ONE).eq(Bytes32.ONE)).to.equal(
      true
    )
    expect(clone.getNonce(address)).to.equal(2)
    expect(clone.getCode(address)).to.deep.equal(Bytes.fromString('0405'))
  })
})
