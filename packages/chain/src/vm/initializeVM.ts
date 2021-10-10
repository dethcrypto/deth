import VM from '@ethereumjs/vm'
import Common from '@ethereumjs/common'
import { Account, Address } from 'ethereumjs-util'
import { Wallet } from 'ethers'
import BN from 'bn.js'
import { ChainOptions } from '../ChainOptions'
import { putGenesisBlock } from './putGenesisBlock'
import { DethBlockchain } from './storage/DethBlockchain'
import { DethStateManger } from './storage/DethStateManger'
import Blockchain from '@ethereumjs/blockchain'
import { BlockchainAdapter } from './storage/BlockchainAdapter'
import { StateManagerAdapter } from './storage/StateManagerAdapter'

export async function initializeVM(
  options: ChainOptions,
  stateManager?: DethStateManger,
  blockchain?: DethBlockchain
) {
  const common = Common.custom(
    {
      chainId: options.chainId,
      networkId: options.chainId,
      name: options.chainName,
    },
    { hardfork: options.hardfork }
  )
  const callbackBlockchain = blockchain
    ? new BlockchainAdapter(blockchain)
    : await Blockchain.create({
        common,
        validateBlocks: false,
        validateConsensus: false,
      })
  const stateManger = stateManager
    ? new StateManagerAdapter(stateManager)
    : undefined
  const vm = new VM({
    common,
    stateManager: stateManger as any,
    blockchain: callbackBlockchain as any,
  })
  await initAccounts(vm, options)
  await putGenesisBlock(vm, options)
  return vm
}

// @TODO extract this. VM should not be aware of any private keys etc. TestChain should provide data for genesis block
async function initAccounts(vm: VM, options: ChainOptions) {
  const psm = vm.stateManager
  const balance = new BN(options.accounts.initialBalance.toString())

  for (const privateKey of options.accounts.privateKeys) {
    const { address } = new Wallet(privateKey)
    await psm.putAccount(
      Address.fromString(address),
      new Account(undefined, balance)
    )
  }
}
