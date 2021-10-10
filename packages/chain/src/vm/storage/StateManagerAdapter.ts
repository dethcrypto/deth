import {} from 'util'
import { DethStateManger } from './DethStateManger'
import { Account } from 'ethereumjs-util'
import {
  bufferToHash,
  hashToBuffer,
  bufferToQuantity,
  bufferToAddress,
} from '../../model'
export class StateManagerAdapter {
  constructor(readonly dethStateManager: DethStateManger) {}

  getAccount = async (address: Buffer) => {
    return this.dethStateManager.getAccount(bufferToAddress(address))
  }

  putAccount = async (address: Buffer, account: Account) => {
    return this.dethStateManager.putAccount(bufferToAddress(address), account)
  }

  putContractCode = async (address: Buffer, code: Buffer) => {
    return this.dethStateManager.putContractCode(bufferToAddress(address), code)
  }

  getContractCode = async (address: Buffer): Promise<Buffer> => {
    return this.dethStateManager.getContractCode(bufferToAddress(address))
  }

  getContractStorage = async (address: Buffer, key: Buffer) => {
    return this.dethStateManager.getContractStorage(
      bufferToAddress(address),
      bufferToQuantity(key)
    )
  }

  putContractStorage = async (address: Buffer, key: Buffer, value: Buffer) => {
    return this.dethStateManager.putContractStorage(
      bufferToAddress(address),
      bufferToQuantity(key),
      value
    )
  }

  clearContractStorage = async (address: Buffer) => {
    return this.dethStateManager.clearContractStorage(bufferToAddress(address))
  }

  checkpoint = this.dethStateManager.checkpoint.bind(this.dethStateManager)
  commit = this.dethStateManager.commit.bind(this.dethStateManager)
  revert = this.dethStateManager.revert.bind(this.dethStateManager)
  getStateRoot = async (): Promise<Buffer> => {
    return hashToBuffer(this.dethStateManager.getStateRoot())
  }

  accountIsEmpty = async (address: Buffer) => {
    return this.dethStateManager.isAccountEmpty(bufferToAddress(address))
  }

  setStateRoot = async (root: Buffer) => {
    return this.dethStateManager.setStateRoot(bufferToHash(root))
  }

  getOriginalContractStorage = () => {
    console.trace()
    throw new Error('Not implemented yet!')
  }

  dumpStorage = () => {
    console.trace()
    throw new Error('Not implemented yet!')
  }

  hasGenesisState = () => {
    console.trace()
    throw new Error('Not implemented yet!')
  }

  generateCanonicalGenesis = () => {
    console.trace()
    throw new Error('Not implemented yet!')
  }

  generateGenesis = () => {
    console.trace()
    throw new Error('Not implemented yet!')
  }

  // eslint-disable-next-line
  cleanupTouchedAccounts = async () => {}
  // eslint-disable-next-line
  _clearOriginalStorageCache = () => {}
}
