import { bufferToInt } from 'ethereumjs-util'
import { utils, Wallet, providers } from 'ethers'
import {
  Address,
  BlockTag,
  Hash,
  HexString,
  TransactionRequest,
  FilterRequest,
  LogResponse,
  TransactionResponse,
  BlockResponse,
  TransactionReceiptResponse,
  toFakeTransaction,
  toBlockResponse,
  toTransactionResponse,
} from './model'
import { TestVM } from './TestVM'
import { TestChainOptions, getOptionsWithDefaults } from './TestChainOptions'
import { bufferToAddress } from './utils'

/**
 * TestChain wraps TestVM and provides an API suitable for use by a provider.
 * It is separate from the provider so that there can be many provider instances
 * using the same TestChain instance.
 */
export class TestChain {
  private tvm: TestVM
  private options: TestChainOptions

  constructor (options?: Partial<TestChainOptions>) {
    this.options = getOptionsWithDefaults(options)
    this.tvm = new TestVM(this.options)
  }

  getWallets (provider?: providers.Provider) {
    return this.options.privateKeys.map(x => new Wallet(x, provider))
  }

  async mineBlock () {
    return this.tvm.mineBlock()
  }

  async getBlockNumber (): Promise<number> {
    const block = await this.tvm.getLatestBlock()
    return bufferToInt(block.header.number)
  }

  async getGasPrice (): Promise<utils.BigNumber> {
    return this.options.defaultGasPrice
  }

  async getBalance (address: Address, blockTag: BlockTag): Promise<utils.BigNumber> {
    if (blockTag !== 'latest') {
      throw new Error(`getBalance: Unsupported blockTag "${blockTag}". Use "latest".`)
    }
    const { balance } = await this.tvm.getAccount(address)
    return utils.bigNumberify(balance)
  }

  async getTransactionCount (address: Address, blockTag: BlockTag): Promise<number> {
    if (blockTag === 'latest') {
      return this.getLatestTransactionCount(address)
    } else if (blockTag === 'pending') {
      return this.getPendingTransactionCount(address)
    } else {
      throw new Error(`getTransactionCount: Unsupported blockTag "${blockTag}". Use "latest" or "pending".`)
    }
  }

  private async getLatestTransactionCount (address: Address): Promise<number> {
    const { nonce } = await this.tvm.getAccount(address)
    return bufferToInt(nonce)
  }

  private async getPendingTransactionCount (address: Address): Promise<number> {
    const txCount = await this.getLatestTransactionCount(address)
    const transactionsFromAddress = this.tvm.pendingTransactions
      .filter(tx => bufferToAddress(tx.getSenderAddress()) === address)
      .length
    return txCount + transactionsFromAddress
  }

  async getCode (address: Address, blockTag: BlockTag): Promise<HexString> {
    if (blockTag !== 'latest') {
      throw new Error(`getCode: Unsupported blockTag "${blockTag}". Use "latest".`)
    }
    return this.tvm.getCode(address)
  }

  async getStorageAt (address: Address, position: HexString, blockTag: BlockTag): Promise<HexString> {
    throw new Error('(getStorageAt) Not implemented!')
  }

  async sendTransaction (signedTransaction: HexString): Promise<Hash> {
    const hash = await this.tvm.addPendingTransaction(signedTransaction)
    await this.tvm.mineBlock()
    return hash
  }

  async call (transactionRequest: TransactionRequest, blockTag: BlockTag): Promise<HexString> {
    if (blockTag !== 'latest') {
      throw new Error(`call: Unsupported blockTag "${blockTag}". Use "latest".`)
    }
    const tx = toFakeTransaction(transactionRequest)
    const result = await this.tvm.runIsolatedTransaction(tx)
    return utils.hexlify(result.execResult.returnValue)
  }

  async estimateGas (transactionRequest: TransactionRequest): Promise<utils.BigNumber> {
    if (!transactionRequest.gasLimit) {
      transactionRequest.gasLimit = utils.bigNumberify(this.options.blockGasLimit)
    }
    const tx = toFakeTransaction(transactionRequest)
    const result = await this.tvm.runIsolatedTransaction(tx)
    return utils.bigNumberify(result.gasUsed.toString())
  }

  async getBlock (blockTagOrHash: BlockTag | Hash, includeTransactions: boolean): Promise<BlockResponse> {
    if (blockTagOrHash === 'pending') {
      throw new Error('getBlock: Unsupported blockTag "pending".')
    }

    const block = blockTagOrHash === 'latest'
      ? await this.tvm.getLatestBlock()
      : await this.tvm.getBlock(blockTagOrHash)

    const response = toBlockResponse(block)
    if (includeTransactions) {
      response.transactions = block.transactions
        .map(tx => toTransactionResponse(tx, block))
    }
    return response
  }

  async getTransaction (transactionHash: Hash): Promise<TransactionResponse> {
    const transaction = await this.tvm.getTransaction(transactionHash)
    if (!transaction) {
      throw new Error('Not found')
    }
    return transaction
  }

  async getTransactionReceipt (transactionHash: Hash): Promise<TransactionReceiptResponse> {
    const transaction = await this.tvm.getTransactionReceipt(transactionHash)
    if (!transaction) {
      throw new Error('Not found')
    }
    return transaction
  }

  async getLogs (filter: FilterRequest): Promise<LogResponse[]> {
    throw new Error('(getLogs) Not implemented!')
  }
}
