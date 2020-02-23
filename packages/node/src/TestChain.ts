import { Address, Hash, Quantity, bnToQuantity, HexData, bufferToHexData, bufferToAddress } from './primitives'
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
import { TestChainOptions, getTestChainOptionsWithDefaults } from './TestChainOptions'
import { transactionNotFound, unsupportedBlockTag, unsupportedOperation } from './errors'
import { eventLogger, revertLogger } from './debugger/stepsLoggers'
import { SnapshotObject } from './vm/storage/SnapshotObject'
import { cloneDeep } from 'lodash'
import { Transaction } from 'ethereumjs-tx'
import { DethLogger } from './debugger/Logger/DethLogger'

/**
 * TestChain wraps TestVM and provides an API suitable for use by a provider.
 * It is separate from the provider so that there can be many provider instances
 * using the same TestChain instance.
 */
export class TestChain {
  private tvm: TestVM
  options: SnapshotObject<TestChainOptions>

  constructor (private logger: DethLogger, options?: Partial<TestChainOptions>) {
    this.options = new SnapshotObject(getTestChainOptionsWithDefaults(options), cloneDeep)
    this.tvm = new TestVM(this.options.value)
  }

  async init () {
    await this.tvm.init()

    this.tvm.installStepHook(eventLogger(this.logger))
    this.tvm.installStepHook(revertLogger(this.logger))
  }

  makeSnapshot (): number {
    this.options.makeSnapshot()
    return this.tvm.makeSnapshot()
  }

  revertToSnapshot (id: number) {
    this.options.revert(id)
    return this.tvm.revertToSnapshot(id)
  }

  skewClock (delta: number) {
    this.options.value.clockSkew += delta
  }

  startAutoMining () {
    this.options.value.autoMining = true
  }

  stopAutoMining () {
    this.options.value.autoMining = false
  }

  async mineBlock () {
    return this.tvm.mineBlock(this.options.value.clockSkew)
  }

  async getBlockNumber (): Promise<Quantity> {
    return this.tvm.getBlockNumber()
  }

  getGasPrice (): Quantity {
    return bnToQuantity(this.options.value.defaultGasPrice)
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
    // @TODO: always assumes blockTag === latest

    return bufferToHexData(this.tvm.state.value.stateManger.getContractStorage(address, position))
  }

  async sendTransaction (signedTransaction: HexData): Promise<Hash> {
    this.logger.logTransaction(this.parseTx(signedTransaction))
    const hash = await this.tvm.addPendingTransaction(signedTransaction)
    if (this.options.value.autoMining) {
      await this.tvm.mineBlock(this.options.value.clockSkew)
    }
    return hash
  }

  async call (transactionRequest: RpcTransactionRequest, blockTag: Quantity | Tag): Promise<HexData> {
    if (blockTag !== 'latest') {
      throw unsupportedBlockTag('call', blockTag, ['latest'])
    }
    const tx = toFakeTransaction({
      ...transactionRequest,
      gas: bnToQuantity(this.options.value.blockGasLimit),
    })
    const result = await this.tvm.runIsolatedTransaction(tx, this.options.value.clockSkew)
    // TODO: handle errors
    return bufferToHexData(result.execResult.returnValue)
  }

  // @NOTE: this is very simplified implementation
  async estimateGas (transactionRequest: RpcTransactionRequest): Promise<Quantity> {
    if (!transactionRequest.gas) {
      transactionRequest.gas = bnToQuantity(this.options.value.blockGasLimit)
    }
    const tx = toFakeTransaction(transactionRequest)
    const result = await this.tvm.runIsolatedTransaction(tx, this.options.value.clockSkew)
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

  private parseTx (signedTransaction: HexData) {
    const tx = new Transaction(signedTransaction, { common: this.tvm.vm._common })

    return {
      to: tx.to?.length > 0 ? bufferToAddress(tx.to) : undefined,
      from: bufferToAddress((tx as any).from),
      data: tx.data?.length > 0 ? bufferToHexData(tx.data) : undefined,
    }
  }
}
