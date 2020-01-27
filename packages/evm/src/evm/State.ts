import { Bytes32 } from './Bytes32'
import { Address } from './Address'
import { Byte } from './Byte'

export class State {
  private balances: Record<string, Bytes32 | undefined> = {}
  private nonces: Record<string, number | undefined> = {}
  private storage: Record<string, Bytes32 | undefined> = {}
  private codes: Record<string, readonly Byte[] | undefined> = {}

  getBalance (address: Address): Bytes32 {
    return this.balances[address] ?? Bytes32.ZERO
  }

  setBalance (address: Address, balance: Bytes32) {
    this.balances[address] = balance
  }

  getNonce (address: Address): number {
    return this.nonces[address] ?? 0
  }

  setNonce (address: Address, value: number) {
    this.nonces[address] = value
  }

  getStorage (address: Address, location: Bytes32): Bytes32 {
    return this.storage[getStorageKey(address, location)] ?? Bytes32.ZERO
  }

  setStorage (address: Address, location: Bytes32, value: Bytes32) {
    this.storage[getStorageKey(address, location)] = value
  }

  getCode (address: Address): readonly Byte[] {
    return this.codes[address] ?? []
  }

  setCode (address: Address, value: readonly Byte[]) {
    this.codes[address] = [...value]
  }

  clone (): State {
    const clone = new State()
    clone.balances = { ...this.balances }
    clone.nonces = { ...this.nonces }
    clone.storage = { ...this.storage }
    clone.codes = { ...this.codes }
    return clone
  }
}

function getStorageKey (address: Address, location: Bytes32) {
  return address + '.' + location.toHex()
}
