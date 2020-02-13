import { providers } from 'ethers'
import { TestChain } from './TestChain'
import { toRpcTransactionRequest } from './model'
import { TestProviderOptions, toTestChainOptions } from './TestProviderOptions'
import { WalletManager } from './WalletManager'
import { makeAddress, makeQuantity } from './primitives'
import { DEFAULTS } from './TestChainOptions'

export class TestProvider extends providers.BaseProvider {
  private chain: TestChain
  readonly walletManager: WalletManager

  constructor (chainOrOptions?: TestChain | TestProviderOptions) {
    super({ name: DEFAULTS.chainName, chainId: DEFAULTS.chainId })
    if (chainOrOptions instanceof TestChain) {
      this.chain = chainOrOptions
      this.walletManager = new WalletManager(undefined, this)
    } else {
      this.chain = new TestChain(toTestChainOptions(chainOrOptions))
      this.walletManager = new WalletManager(this.chain.options.value.privateKeys, this)
    }
  }

  async init () {
    await this.chain.init()
  }

  async mineBlock () {
    return this.chain.mineBlock()
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async perform (method: string, params: any) {
    switch (method) {
      case 'getBlockNumber':
        return this.chain.getBlockNumber()
      case 'getGasPrice':
        return this.chain.getGasPrice()
      case 'getBalance':
        return this.chain.getBalance(makeAddress(params.address), params.blockTag)
      case 'getTransactionCount':
        return this.chain.getTransactionCount(makeAddress(params.address), params.blockTag)
      case 'getCode':
        return this.chain.getCode(makeAddress(params.address), params.blockTag)
      case 'getStorageAt':
        return this.chain.getStorageAt(makeAddress(params.address), makeQuantity(params.position), params.blockTag)
      case 'sendTransaction':
        return this.chain.sendTransaction(params.signedTransaction)
      case 'call':
        return this.chain.call(toRpcTransactionRequest(params.transaction), params.blockTag)
      case 'estimateGas':
        return this.chain.estimateGas(toRpcTransactionRequest(params.transaction))
      case 'getBlock':
        return this.chain.getBlock(params.blockTag ?? params.blockHash, params.includeTransactions)
      case 'getTransaction':
        return this.chain.getTransaction(params.transactionHash)
      case 'getTransactionReceipt':
        return this.chain.getTransactionReceipt(params.transactionHash)
      case 'getLogs':
        return this.chain.getLogs(params.filter)
      default:
        return super.perform(method, params)
    }
  }
}
