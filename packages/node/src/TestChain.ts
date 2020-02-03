import { Address, Hash, Quantity, bnToQuantity, HexData, bufferToHexData } from './primitives'
import {
  Tag,
  RpcTransactionRequest,
  FilterRequest,
  RpcLogObject,
  RpcTransactionResponse,
  RpcBlockResponse,
  RpcTransactionReceipt,
  toFakeTransaction,
  RpcRichBlockResponse,
} from './model'
import { TestVM } from './vm/TestVM'
import { TestChainOptions, getOptionsWithDefaults } from './TestChainOptions'
import { transactionNotFound, unsupportedBlockTag, unsupportedOperation } from './errors'
import { eventLogger, revertLogger } from './debugger/stepsLoggers'
import { AbiDecoder } from './debugger/AbiDecoder'
import { RealFileSystem } from './fs/RealFileSystem'

/**
 * TestChain wraps TestVM and provides an API suitable for use by a provider.
 * It is separate from the provider so that there can be many provider instances
 * using the same TestChain instance.
 */
export class TestChain {
  private tvm: TestVM
  private autoMining = true
  clockSkew = 0;
  options: TestChainOptions

  constructor (options?: Partial<TestChainOptions>) {
    this.options = getOptionsWithDefaults(options)
    this.tvm = new TestVM(this.options)
  }

  async init () {
    await this.tvm.init()
    // @TODO: initialization of deps should be moved out from here
    const abiDecoder = new AbiDecoder(new RealFileSystem())
    if (this.options.abiFilesGlob) {
      abiDecoder.loadAbis(this.options.abiFilesGlob, this.options.cwd)
    }

    this.tvm.installStepHook(eventLogger(abiDecoder))
    this.tvm.installStepHook(revertLogger)
  }

  makeSnapshot (): number {
    return this.tvm.makeSnapshot()
  }

  revertToSnapshot (id: number) {
    return this.tvm.revertToSnapshot(id)
  }

  startAutoMining () {
    this.autoMining = true
  }

  stopAutoMining () {
    this.autoMining = false
  }

  async mineBlock () {
    return this.tvm.mineBlock(this.clockSkew)
  }

  async getBlockNumber (): Promise<Quantity> {
    return this.tvm.getBlockNumber()
  }

  getGasPrice (): Quantity {
    return bnToQuantity(this.options.defaultGasPrice)
  }

  async getBalance (address: Address, blockTag: Quantity | Tag): Promise<Quantity> {
    if (blockTag !== 'latest') {
      throw unsupportedBlockTag('getBalance', blockTag, ['latest'])
    }
    return this.tvm.getBalance(address)
  }

  async getTransactionCount (address: Address, blockTag: Quantity | Tag): Promise<Quantity> {
    if (blockTag !== 'latest' && blockTag !== 'pending') {
      throw unsupportedBlockTag('getTransactionCount', blockTag, ['latest', 'pending'])
    }
    // TODO: handle pending better
    return this.tvm.getNonce(address)
  }

  async getCode (address: Address, blockTag: Quantity | Tag): Promise<HexData> {
    if (blockTag !== 'latest') {
      throw unsupportedBlockTag('getCode', blockTag, ['latest'])
    }
    return this.tvm.getCode(address)
  }

  async getStorageAt (address: Address, position: Quantity, blockTag: Quantity | Tag): Promise<HexData> {
    throw unsupportedOperation('getStorageAt')
  }

  async sendTransaction (signedTransaction: HexData): Promise<Hash> {
    const hash = await this.tvm.addPendingTransaction(signedTransaction)
    if (this.autoMining) {
      await this.tvm.mineBlock(this.clockSkew)
    }
    return hash
  }

  async call (transactionRequest: RpcTransactionRequest, blockTag: Quantity | Tag): Promise<HexData> {
    if (blockTag !== 'latest') {
      throw unsupportedBlockTag('call', blockTag, ['latest'])
    }
    const tx = toFakeTransaction({
      ...transactionRequest,
      gas: bnToQuantity(this.options.blockGasLimit),
    })
    const result = await this.tvm.runIsolatedTransaction(tx, this.clockSkew)
    // TODO: handle errors
    return bufferToHexData(result.execResult.returnValue)
  }

  // @NOTE: this is very simplified implementation
  async estimateGas (transactionRequest: RpcTransactionRequest): Promise<Quantity> {
    if (!transactionRequest.gas) {
      transactionRequest.gas = bnToQuantity(this.options.blockGasLimit)
    }
    const tx = toFakeTransaction(transactionRequest)
    const result = await this.tvm.runIsolatedTransaction(tx, this.clockSkew)
    // TODO: handle errors
    return bnToQuantity(result.gasUsed)
  }

  async getBlock (
    blockTagOrHash: Quantity | Tag | Hash,
    includeTransactions: boolean,
  ): Promise<RpcBlockResponse | RpcRichBlockResponse> {
    if (blockTagOrHash === 'pending') {
      throw unsupportedBlockTag('call', blockTagOrHash)
    }

    const block =
      blockTagOrHash === 'latest' ? await this.tvm.getLatestBlock() : await this.tvm.getBlock(blockTagOrHash)

    if (!includeTransactions) {
      return block
    }
    const transactions = block.transactions.map(tx => this.getTransaction(tx))
    return { ...block, transactions }
  }

  getTransaction (transactionHash: Hash): RpcTransactionResponse {
    const transaction = this.tvm.getTransaction(transactionHash)
    if (!transaction) {
      throw transactionNotFound(transactionHash)
    }
    return transaction
  }

  getTransactionReceipt (transactionHash: Hash): RpcTransactionReceipt | undefined {
    return this.tvm.getTransactionReceipt(transactionHash)
  }

  async getLogs (filter: FilterRequest): Promise<RpcLogObject[]> {
    throw unsupportedOperation('getLogs')
  }
}
