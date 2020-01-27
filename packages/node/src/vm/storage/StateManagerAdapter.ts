import { callbackify } from 'util'
import { DethStateManger } from './DethStateManger'
import { bufferToAddress } from '../../primitives/Address'
import Account from 'ethereumjs-account'
import { bufferToHash, hashToBuffer } from '../../primitives'
import { callbackifySync } from './adapter-utils'

export class StateManagerAdapter {
  constructor (readonly dethStateManager: DethStateManger) {}

  getAccount = callbackify(async (address: Buffer) => {
    return this.dethStateManager.getAccount(bufferToAddress(address))
  })

  putAccount = callbackify(async (address: Buffer, account: Account) => {
    return this.dethStateManager.putAccount(bufferToAddress(address), account)
  })

  putContractCode = callbackify(async (address: Buffer, code: Buffer) => {
    return this.dethStateManager.putContractCode(bufferToAddress(address), code)
  })

  getContractCode = callbackify(
    async (address: Buffer): Promise<Buffer> => {
      return this.dethStateManager.getContractCode(bufferToAddress(address))
    },
  )

  getContractStorage = callbackify(async (address: Buffer, key: Buffer) => {
    return this.dethStateManager.getContractStorage(bufferToAddress(address), bufferToHash(key))
  })

  putContractStorage = callbackify(async (address: Buffer, key: Buffer, value: Buffer) => {
    return this.dethStateManager.putContractStorage(bufferToAddress(address), bufferToHash(key), value)
  })

  clearContractStorage = callbackify(async (address: Buffer) => {
    return this.dethStateManager.clearContractStorage(bufferToAddress(address))
  })

  checkpoint = callbackifySync(this.dethStateManager.checkpoint.bind(this.dethStateManager))
  commit = callbackifySync(this.dethStateManager.commit.bind(this.dethStateManager))
  revert = callbackifySync(this.dethStateManager.revert.bind(this.dethStateManager))
  getStateRoot = callbackify(
    async (): Promise<Buffer> => {
      return hashToBuffer(this.dethStateManager.getStateRoot())
    },
  )

  accountIsEmpty = callbackify(async (address: Buffer) => {
    return this.dethStateManager.isAccountEmpty(bufferToAddress(address))
  })

  setStateRoot = callbackify(async (root: Buffer) => {
    return this.dethStateManager.setStateRoot(bufferToHash(root))
  })

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
  cleanupTouchedAccounts = callbackify(async () => {})
  // eslint-disable-next-line
  _clearOriginalStorageCache = () => {}
}
