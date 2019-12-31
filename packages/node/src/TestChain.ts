import { bufferToInt } from 'ethereumjs-util'
import { utils, Wallet, providers } from 'ethers'
import {
  Address,
  Hash,
  HexString,
  makeHexString,
  bufferToAddress,
  bufferToHexString,
  bufferToHash,
  Quantity
} from './primitives'
import {
  Tag,
  TransactionRequest,
  FilterRequest,
  LogResponse,
  TransactionResponse,
  BlockResponse,
  TransactionReceiptResponse,
  toFakeTransaction,
  toBlockResponse,
} from './model'
import { TestVM } from './vm/TestVM'
import { TestChainOptions, getOptionsWithDefaults } from './TestChainOptions'
import {
  transactionNotFound,
  unsupportedBlockTag,
  unsupportedOperation,
} from './errors'

/**
 * TestChain wraps TestVM and provides an API suitable for use by a provider.
 * It is separate from the provider so that there can be many provider instances
 * using the same TestChain instance.
 */
export class TestChain {
  private tvm: TestVM
  private options: TestChainOptions

  constructor(options?: Partial<TestChainOptions>) {
    this.options = getOptionsWithDefaults(options)
    this.tvm = new TestVM(this.options)
  }

  getWallets(provider?: providers.Provider) {
    return this.options.privateKeys.map(x => new Wallet(x, provider))
  }

  async mineBlock() {
    return this.tvm.mineBlock()
  }

  async getBlockNumber(): Promise<number> {
    const block = await this.tvm.getLatestBlock()
    return bufferToInt(block.header.number)
  }

  getGasPrice(): utils.BigNumber {
    return this.options.defaultGasPrice
  }

  async getBalance(address: Address, blockTag: Quantity | Tag): Promise<utils.BigNumber> {
    if (blockTag !== 'latest') {
      throw unsupportedBlockTag('getBalance', blockTag, ['latest'])
    }
    const account = await this.tvm.getAccount(address)
    return utils.bigNumberify(account.balance)
  }

  async getTransactionCount(address: Address, blockTag: Quantity | Tag): Promise<number> {
    if (blockTag === 'latest') {
      return this.getLatestTransactionCount(address)
    } else if (blockTag === 'pending') {
      return this.getPendingTransactionCount(address)
    } else {
      throw unsupportedBlockTag('getTransactionCount', blockTag, ['latest', 'pending'])
    }
  }

  private async getLatestTransactionCount(address: Address): Promise<number> {
    const account = await this.tvm.getAccount(address)
    return bufferToInt(account.nonce)
  }

  private async getPendingTransactionCount(address: Address): Promise<number> {
    const txCount = await this.getLatestTransactionCount(address)
    const transactionsFromAddress = this.tvm.pendingTransactions
      .filter(tx => bufferToAddress(tx.getSenderAddress()) === address)
      .length
    return txCount + transactionsFromAddress
  }

  async getCode(address: Address, blockTag: Quantity | Tag): Promise<HexString> {
    if (blockTag !== 'latest') {
      throw unsupportedBlockTag('getCode', blockTag, ['latest'])
    }
    return makeHexString(await this.tvm.getCode(address))
  }

  async getStorageAt(address: Address, position: HexString, blockTag: Quantity | Tag): Promise<HexString> {
    throw unsupportedOperation('getStorageAt')
  }

  async sendTransaction(signedTransaction: HexString): Promise<Hash> {
    const hash = await this.tvm.addPendingTransaction(signedTransaction)
    await this.tvm.mineBlock()
    return hash
  }

  async call(transactionRequest: TransactionRequest, blockTag: Quantity | Tag): Promise<HexString> {
    if (blockTag !== 'latest') {
      throw unsupportedBlockTag('call', blockTag, ['latest'])
    }
    const tx = toFakeTransaction({
      ...transactionRequest,
      gasLimit: this.options.blockGasLimit,
    })
    const result = await this.tvm.runIsolatedTransaction(tx)
    // TODO: handle errors
    return bufferToHexString(result.execResult.returnValue)
  }

  async estimateGas(transactionRequest: TransactionRequest): Promise<utils.BigNumber> {
    if (!transactionRequest.gasLimit) {
      transactionRequest.gasLimit = utils.bigNumberify(this.options.blockGasLimit)
    }
    const tx = toFakeTransaction(transactionRequest)
    const result = await this.tvm.runIsolatedTransaction(tx)
    // TODO: handle errors
    return utils.bigNumberify(result.gasUsed.toString())
  }

  async getBlock(blockTagOrHash: Quantity | Tag | Hash, includeTransactions: boolean): Promise<BlockResponse> {
    if (blockTagOrHash === 'pending') {
      throw unsupportedBlockTag('call', blockTagOrHash)
    }

    const block = blockTagOrHash === 'latest'
      ? await this.tvm.getLatestBlock()
      : await this.tvm.getBlock(blockTagOrHash)

    const response = toBlockResponse(block)
    if (includeTransactions) {
      response.transactions = block.transactions
        .map(tx => this.getTransaction(bufferToHash(tx.hash())))
    }
    return response
  }

  getTransaction(transactionHash: Hash): TransactionResponse {
    const transaction = this.tvm.getTransaction(transactionHash)
    if (!transaction) {
      throw transactionNotFound(transactionHash)
    }
    return transaction
  }

  getTransactionReceipt(transactionHash: Hash): TransactionReceiptResponse {
    const transaction = this.tvm.getTransactionReceipt(transactionHash)
    if (!transaction) {
      throw transactionNotFound(transactionHash)
    }
    return transaction
  }

  async getLogs(filter: FilterRequest): Promise<LogResponse[]> {
    throw unsupportedOperation('getLogs')
  }
}
