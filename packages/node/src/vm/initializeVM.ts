import VM from 'ethereumjs-vm'
import Common from 'ethereumjs-common'
import Account from 'ethereumjs-account'
import { toBuffer } from 'ethereumjs-util'
import { Wallet } from 'ethers'
import BN from 'bn.js'
import { TestChainOptions } from '../TestChainOptions'
import { CHAIN_ID, CHAIN_NAME } from '../constants'
import { putGenesisBlock } from './putGenesisBlock'
import { DethBlockchain } from './storage/DethBlockchain'
import { DethStateManger } from './storage/DethStateManger'
import Blockchain from 'ethereumjs-blockchain'
import { BlockchainAdapter } from './storage/BlockchainAdapter'
import { StateManagerAdapter } from './storage/StateManagerAdapter'

export async function initializeVM (
  options: TestChainOptions,
  stateManager?: DethStateManger,
  blockchain?: DethBlockchain,
) {
  const common = Common.forCustomChain(
    'mainnet',
    {
      chainId: CHAIN_ID,
      networkId: CHAIN_ID,
      name: CHAIN_NAME,
    },
    options.hardfork,
  )
  const callbackBlockchain = blockchain
    ? new BlockchainAdapter(blockchain)
    : new Blockchain({ common, validate: false })
  const stateManger = stateManager ? new StateManagerAdapter(stateManager) : undefined
  const vm = new VM({ common, stateManager: stateManger as any, blockchain: callbackBlockchain as any })
  await initAccounts(vm, options)
  await putGenesisBlock(vm, options)
  return vm
}

// @TODO extract this. VM should not be aware of any private keys etc. TestChain should provide data for genesis block
async function initAccounts (vm: VM, options: TestChainOptions) {
  const psm = vm.pStateManager
  const balance = new BN(options.initialBalance.toString()).toBuffer()
  for (const privateKey of options.privateKeys) {
    const { address } = new Wallet(privateKey)
    await psm.putAccount(toBuffer(address), new Account({ balance }))
  }
}
