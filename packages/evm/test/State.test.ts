import { expect } from 'chai'
import { State } from '../src/State'
import { Bytes32 } from '../src/Bytes32'
import { Byte } from '../src/Byte'
import { ADDRESS_ZERO } from './helpers'

describe('State', () => {
  const address = ADDRESS_ZERO

  it('getBalance returns ZERO by default', () => {
    const state = new State()
    const result = state.getBalance(address)
    expect(result.equals(Bytes32.ZERO)).to.equal(true)
  })

  it('getBalance returns previously set value', () => {
    const state = new State()
    state.setBalance(address, Bytes32.ONE)
    const result = state.getBalance(address)
    expect(result.equals(Bytes32.ONE)).to.equal(true)
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
    expect(result.equals(Bytes32.ZERO)).to.equal(true)
  })

  it('getStorage returns previously set value', () => {
    const state = new State()
    state.setStorage(address, Bytes32.ZERO, Bytes32.ONE)
    const result = state.getStorage(address, Bytes32.ZERO)
    expect(result.equals(Bytes32.ONE)).to.equal(true)
  })

  it('getCode returns [] by default', () => {
    const state = new State()
    const result = state.getCode(address)
    expect(result).to.deep.equal([])
  })

  it('getCode returns previously set value', () => {
    const state = new State()
    state.setCode(address, [1, 2, 3] as Byte[])
    const result = state.getCode(address)
    expect(result).to.deep.equal([1, 2, 3])
  })

  it('clone clones the state', () => {
    const state = new State()

    state.setBalance(address, Bytes32.ONE)
    state.setNonce(address, 1)
    state.setStorage(address, Bytes32.ZERO, Bytes32.ONE)
    state.setCode(address, [1, 2, 3] as Byte[])

    const clone = state.clone()

    clone.setBalance(address, Bytes32.MAX)
    clone.setNonce(address, 2)
    clone.setStorage(address, Bytes32.ZERO, Bytes32.MAX)
    clone.setStorage(address, Bytes32.ONE, Bytes32.ONE)
    clone.setCode(address, [4, 5] as Byte[])

    expect(state.getBalance(address).equals(Bytes32.ONE)).to.equal(true)
    expect(state.getStorage(address, Bytes32.ZERO).equals(Bytes32.ONE)).to.equal(true)
    expect(state.getStorage(address, Bytes32.ONE).equals(Bytes32.ZERO)).to.equal(true)
    expect(state.getNonce(address)).to.equal(1)
    expect(state.getCode(address)).to.deep.equal([1, 2, 3])

    expect(clone.getBalance(address).equals(Bytes32.MAX)).to.equal(true)
    expect(clone.getStorage(address, Bytes32.ZERO).equals(Bytes32.MAX)).to.equal(true)
    expect(clone.getStorage(address, Bytes32.ONE).equals(Bytes32.ONE)).to.equal(true)
    expect(clone.getNonce(address)).to.equal(2)
    expect(clone.getCode(address)).to.deep.equal([4, 5])
  })
})
