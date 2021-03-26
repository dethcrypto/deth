import { providers, Wallet } from 'ethers'
import { Chain } from '../../src/Chain'
import {
  toRpcTransactionRequest,
  makeAddress,
  makeQuantity,
} from '../../src/model'
import { TestProviderOptions, toTestChainOptions } from './TestProviderOptions'

export async function createTestProvider(
  chainOrOptions?: Chain | TestProviderOptions
) {
  const provider = new TestProvider(chainOrOptions)
  await provider.init()
  return provider
}

export class TestProvider extends providers.BaseProvider {
  private chain: Chain
  private wallets: Wallet[]

  constructor(chainOrOptions?: Chain | TestProviderOptions) {
    super({ name: 'deth', chainId: 1337 })

    if (chainOrOptions instanceof Chain) {
      this.chain = chainOrOptions
    } else {
      this.chain = new Chain(toTestChainOptions(chainOrOptions))
    }
    this.wallets = this.chain.options.value.accounts.privateKeys.map(
      (pk) => new Wallet(pk, this)
    )
  }

  getWallets() {
    return this.wallets
  }

  createEmptyWallet() {
    return Wallet.createRandom().connect(this)
  }

  async init() {
    await this.chain.init()
  }

  async mineBlock() {
    return this.chain.mineBlock()
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async perform(method: string, params: any) {
    switch (method) {
      case 'getBlockNumber':
        return this.chain.getBlockNumber()
      case 'getGasPrice':
        return this.chain.getGasPrice()
      case 'getBalance':
        return this.chain.getBalance(
          makeAddress(params.address),
          params.blockTag
        )
      case 'getTransactionCount':
        return this.chain.getTransactionCount(
          makeAddress(params.address),
          params.blockTag
        )
      case 'getCode':
        return this.chain.getCode(makeAddress(params.address), params.blockTag)
      case 'getStorageAt':
        return this.chain.getStorageAt(
          makeAddress(params.address),
          makeQuantity(params.position),
          params.blockTag
        )
      case 'sendTransaction':
        return this.chain.sendTransaction(params.signedTransaction)
      case 'call':
        return this.chain.call(
          toRpcTransactionRequest(params.transaction),
          params.blockTag
        )
      case 'estimateGas':
        return this.chain.estimateGas(
          toRpcTransactionRequest(params.transaction)
        )
      case 'getBlock':
        return this.chain.getBlock(
          params.blockTag ?? params.blockHash,
          params.includeTransactions
        )
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
