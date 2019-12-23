import { providers, Wallet } from 'ethers'
import { TestChain } from './TestChain'
import { TestChainOptions } from './TestChainOptions'
import { CHAIN_NAME, CHAIN_ID } from './constants'

export class TestProvider extends providers.BaseProvider {
  private chain: TestChain

  constructor ()
  constructor (chain: TestChain)
  constructor (options: Partial<TestChainOptions>)
  constructor (chainOrOptions?: TestChain | Partial<TestChainOptions>) {
    super({ name: CHAIN_NAME, chainId: CHAIN_ID })
    if (chainOrOptions instanceof TestChain) {
      this.chain = chainOrOptions
    } else {
      this.chain = new TestChain(chainOrOptions)
    }
  }

  getWallets () {
    return this.chain.getWallets(this)
  }

  createEmptyWallet () {
    return Wallet.createRandom().connect(this)
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
        return this.chain.getBalance(params.address, params.blockTag)
      case 'getTransactionCount':
        return this.chain.getTransactionCount(params.address, params.blockTag)
      case 'getCode':
        return this.chain.getCode(params.address, params.blockTag)
      case 'getStorageAt':
        return this.chain.getStorageAt(params.address, params.position, params.blockTag)
      case 'sendTransaction':
        return this.chain.sendTransaction(params.signedTransaction)
      case 'call':
        return this.chain.call(params.transaction, params.blockTag)
      case 'estimateGas':
        return this.chain.estimateGas(params.transaction)
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
