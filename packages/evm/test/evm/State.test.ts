import { expect } from 'chai'
import { State } from '../../src/evm/State'
import { Address } from '../../src/evm/Address'
import { MachineWord } from '../../src/evm/MachineWord'

describe('State', () => {
  const address = '0x1234' as Address

  it('getBalance returns ZERO by default', () => {
    const state = new State()
    const result = state.getBalance(address)
    expect(result.equals(MachineWord.ZERO)).to.equal(true)
  })

  it('getBalance returns previously set value', () => {
    const state = new State()
    state.setBalance(address, MachineWord.ONE)
    const result = state.getBalance(address)
    expect(result.equals(MachineWord.ONE)).to.equal(true)
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
    const result = state.getStorage(address, MachineWord.ZERO)
    expect(result.equals(MachineWord.ZERO)).to.equal(true)
  })

  it('getStorage returns previously set value', () => {
    const state = new State()
    state.setStorage(address, MachineWord.ZERO, MachineWord.ONE)
    const result = state.getStorage(address, MachineWord.ZERO)
    expect(result.equals(MachineWord.ONE)).to.equal(true)
  })

  it('getCode returns [] by default', () => {
    const state = new State()
    const result = state.getCode(address)
    expect(result).to.deep.equal([])
  })

  it('getCode returns previously set value', () => {
    const state = new State()
    state.setCode(address, [1, 2, 3])
    const result = state.getCode(address)
    expect(result).to.deep.equal([1, 2, 3])
  })

  it('clone clones the state', () => {
    const state = new State()

    state.setBalance(address, MachineWord.ONE)
    state.setNonce(address, 1)
    state.setStorage(address, MachineWord.ZERO, MachineWord.ONE)
    state.setCode(address, [1, 2, 3])

    const clone = state.clone()

    clone.setBalance(address, MachineWord.MAX)
    clone.setNonce(address, 2)
    clone.setStorage(address, MachineWord.ZERO, MachineWord.MAX)
    clone.setStorage(address, MachineWord.ONE, MachineWord.ONE)
    clone.setCode(address, [4, 5])

    expect(state.getBalance(address).equals(MachineWord.ONE)).to.equal(true)
    expect(state.getStorage(address, MachineWord.ZERO).equals(MachineWord.ONE)).to.equal(true)
    expect(state.getStorage(address, MachineWord.ONE).equals(MachineWord.ZERO)).to.equal(true)
    expect(state.getNonce(address)).to.equal(1)
    expect(state.getCode(address)).to.deep.equal([1, 2, 3])

    expect(clone.getBalance(address).equals(MachineWord.MAX)).to.equal(true)
    expect(clone.getStorage(address, MachineWord.ZERO).equals(MachineWord.MAX)).to.equal(true)
    expect(clone.getStorage(address, MachineWord.ONE).equals(MachineWord.ONE)).to.equal(true)
    expect(clone.getNonce(address)).to.equal(2)
    expect(clone.getCode(address)).to.deep.equal([4, 5])
  })
})
