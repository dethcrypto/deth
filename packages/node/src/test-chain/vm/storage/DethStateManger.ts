import Account from 'ethereumjs-account'
import { Dictionary, assert } from 'ts-essentials'
import { keccak256 } from 'ethereumjs-util'
import { CheckpointMap } from './CheckpointMap'
import { Address } from '../../../primitives/Address'
import { bufferToHash, Hash, Quantity } from '../../../primitives'

const EMPTY_BUFFER = Buffer.from('')

/**
 * Holds account, code, storage state in memory.
 * Pretends to maintain trie like structure by generating fake state roots and load them as snapshots when needed
 */
export class DethStateManger {
  constructor (
    private accountsState: CheckpointMap<Account, Address> = new CheckpointMap(),
    private codeState: CheckpointMap<Buffer, Hash> = new CheckpointMap(),
    private storageState: CheckpointMap<Dictionary<Buffer>, Address> = new CheckpointMap(),

    private savedAccountsState: CheckpointMap<CheckpointMap<Account>, Hash> = new CheckpointMap(),
    private savedCodeState: CheckpointMap<CheckpointMap<Buffer>, Hash> = new CheckpointMap(),
    private savedStorageState: CheckpointMap<CheckpointMap<Dictionary<Buffer>, Address>, Hash> = new CheckpointMap(),
    private saveIndex = 0,
  ) {}

  copy () {
    return new DethStateManger(
      this.accountsState.copy(),
      this.codeState.copy(),
      this.storageState.copy(),
      this.savedAccountsState.copy(),
      this.savedCodeState.copy(),
      this.savedStorageState.copy(),
      this.saveIndex,
    )
  }

  getAccount (address: Address): Account {
    const account = this.accountsState.get(address) ?? new Account()
    return new Account(account.serialize())
  }

  putAccount (address: Address, account: Account): void {
    this.accountsState.set(address, account)
  }

  putContractCode (address: Address, code: Buffer) {
    const codeHashAsBuffer = keccak256(code)
    const codeHash = bufferToHash(codeHashAsBuffer)
    const account = this.getAccount(address)
    account.codeHash = codeHashAsBuffer
    this.putAccount(address, account)
    this.codeState.set(codeHash, code)
  }

  getContractCode (address: Address): Buffer {
    const account = this.getAccount(address)

    return this.codeState.get(bufferToHash(account.codeHash)) || EMPTY_BUFFER
  }

  getContractStorage (address: Address, key: Quantity): Buffer {
    const s = this.storageState.get(address) ?? {}
    return s[key] ?? EMPTY_BUFFER
  }

  putContractStorage (address: Address, key: Quantity, value: Buffer) {
    const s = this.storageState.get(address) ?? {}
    const newState = { ...s, [key]: value }
    this.storageState.set(address, newState)
  }

  clearContractStorage (address: Address) {
    this.storageState.set(address, {})
  }

  checkpoint () {
    this.accountsState.checkpoint()
    this.codeState.checkpoint()
    this.storageState.checkpoint()
  }

  commit () {
    this.accountsState.commit()
    this.codeState.commit()
    this.storageState.commit()
  }

  revert () {
    this.accountsState.revert()
    this.codeState.revert()
    this.storageState.revert()
  }

  getStateRoot (): Hash {
    const i = this.saveIndex++
    const hash = bufferToHash(keccak256(i))

    this.savedAccountsState.set(hash, this.accountsState.copy())
    this.savedCodeState.set(hash, this.codeState.copy())
    this.savedStorageState.set(hash, this.storageState.copy())

    return hash
  }

  setStateRoot (root: Hash) {
    {
      const s = this.savedAccountsState.get(root)
      assert(s, `state root ${root.toString()} doesnt exist`)
      this.accountsState = s
    }
    {
      const s = this.savedCodeState.get(root)!
      this.codeState = s
    }
    {
      const s = this.savedStorageState.get(root)!
      this.storageState = s
    }
  }

  isAccountEmpty (address: Address): boolean {
    // @todo fix, it's simplified implementation
    return !!this.accountsState.get(address)
  }
}
