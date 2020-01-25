import { MachineWord } from './MachineWord'
import { Address } from './Address'

export interface ReadonlyState {
  getBalance (address: Address): MachineWord,
  getNonce (address: Address): number,
  getStorage (address: Address, location: MachineWord): MachineWord,
  getCode (address: Address): readonly number[],
  clone (): State,
}

export class State {
  private balances: Record<string, MachineWord | undefined> = {}
  private nonces: Record<string, number | undefined> = {}
  private storage: Record<string, MachineWord | undefined> = {}
  private codes: Record<string, readonly number[] | undefined> = {}

  getBalance (address: Address): MachineWord {
    return this.balances[address] ?? MachineWord.ZERO
  }

  setBalance (address: Address, balance: MachineWord) {
    this.balances[address] = balance
  }

  getNonce (address: Address): number {
    return this.nonces[address] ?? 0
  }

  setNonce (address: Address, value: number) {
    this.nonces[address] = value
  }

  getStorage (address: Address, location: MachineWord): MachineWord {
    return this.storage[getStorageKey(address, location)] ?? MachineWord.ZERO
  }

  setStorage (address: Address, location: MachineWord, value: MachineWord) {
    this.storage[getStorageKey(address, location)] = value
  }

  getCode (address: Address): readonly number[] {
    return this.codes[address] ?? []
  }

  setCode (address: Address, value: readonly number[]) {
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

function getStorageKey (address: Address, location: MachineWord) {
  return address + '.' + location.toHexString()
}
