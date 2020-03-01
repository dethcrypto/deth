import { Address, Hash, Quantity, bnToQuantity, HexData, bufferToHexData, bufferToAddress, numberToQuantity, quantityToNumber } from './model'
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
import { SaneVM } from './vm/SaneVM'
import { ChainOptions, getChainOptionsWithDefaults } from './ChainOptions'
import { transactionNotFound, unsupportedBlockTag, unsupportedOperation } from './errors'
import { Snapshot } from './utils/Snapshot'
import { cloneDeep } from 'lodash'
import { Transaction } from 'ethereumjs-tx'
import { EventEmitter } from './utils/EventEmitter'
// eslint-disable-next-line no-restricted-imports
import { InterpreterStep } from 'ethereumts-vm/dist/evm/interpreter'
import { assert } from 'ts-essentials'

export interface TransactionEvent {
  to?: Address,
  from: Address,
  data?: HexData,
}

/**
 * TestChain wraps TestVM and provides an API suitable for use by a provider.
 * It is separate from the provider so that there can be many provider instances
 * using the same TestChain instance.
 */
export class Chain {
  private vm: SaneVM
  private vmStepEvents = new EventEmitter<InterpreterStep>()
  private transactionEvents = new EventEmitter<TransactionEvent>()
  options: Snapshot<ChainOptions>

  constructor (options?: Partial<ChainOptions>) {
    this.options = new Snapshot(getChainOptionsWithDefaults(options), cloneDeep)
    this.vm = new SaneVM(this.options.value)
  }

  async init () {
    await this.vm.init()

    this.vm.installStepHook(runState => this.vmStepEvents.emit(runState))
  }

  onVmStep (listener: (runState: InterpreterStep) => void) {
    return this.vmStepEvents.addListener(listener)
  }

  onTransaction (listener: (event: TransactionEvent) => void) {
    return this.transactionEvents.addListener(listener)
  }

  makeSnapshot (): number {
    this.options.save()
    return this.vm.makeSnapshot()
  }

  revertToSnapshot (id: number) {
    this.options.revert(id)
    return this.vm.revertToSnapshot(id)
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
    return this.vm.mineBlock(this.options.value.clockSkew)
  }

  async getBlockNumber (): Promise<Quantity> {
    return this.vm.getBlockNumber()
  }

  getGasPrice (): Quantity {
    return bnToQuantity(this.options.value.defaultGasPrice)
  }

  async getBalance (address: Address, blockTag: Quantity | Tag): Promise<Quantity> {
    if (blockTag !== 'latest') {
      throw unsupportedBlockTag('getBalance', blockTag, ['latest'])
    }
    return this.vm.getBalance(address)
  }

  async getTransactionCount (address: Address, blockTag: Quantity | Tag): Promise<Quantity> {
    if (blockTag !== 'latest' && blockTag !== 'pending') {
      throw unsupportedBlockTag('getTransactionCount', blockTag, ['latest', 'pending'])
    }
    // TODO: handle pending better
    return this.vm.getNonce(address)
  }

  async getCode (address: Address, blockTag: Quantity | Tag): Promise<HexData> {
    if (blockTag !== 'latest') {
      throw unsupportedBlockTag('getCode', blockTag, ['latest'])
    }
    return this.vm.getCode(address)
  }

  async getStorageAt (address: Address, position: Quantity, blockTag: Quantity | Tag): Promise<HexData> {
    // @TODO: always assumes blockTag === latest

    return bufferToHexData(this.vm.state.value.stateManger.getContractStorage(address, position))
  }

  async sendTransaction (signedTransaction: HexData): Promise<Hash> {
    this.transactionEvents.emit(this.parseTx(signedTransaction))
    const hash = await this.vm.addPendingTransaction(signedTransaction)
    if (this.options.value.autoMining) {
      await this.vm.mineBlock(this.options.value.clockSkew)
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
    const result = await this.vm.runIsolatedTransaction(tx, this.options.value.clockSkew)
    // TODO: handle errors
    return bufferToHexData(result.execResult.returnValue)
  }

  // @NOTE: this is very simplified implementation
  async estimateGas (transactionRequest: RpcTransactionRequest): Promise<Quantity> {
    if (!transactionRequest.gas) {
      transactionRequest.gas = bnToQuantity(this.options.value.blockGasLimit)
    }
    const tx = toFakeTransaction(transactionRequest)
    const result = await this.vm.runIsolatedTransaction(tx, this.options.value.clockSkew)
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
      blockTagOrHash === 'latest' ? await this.vm.getLatestBlock() : await this.vm.getBlock(blockTagOrHash)

    if (!includeTransactions) {
      return block
    }
    const transactions = block.transactions.map(tx => this.getTransaction(tx))
    return { ...block, transactions }
  }

  getTransaction (transactionHash: Hash): RpcTransactionResponse {
    const transaction = this.vm.getTransaction(transactionHash)
    if (!transaction) {
      throw transactionNotFound(transactionHash)
    }
    return transaction
  }

  getTransactionReceipt (transactionHash: Hash): RpcTransactionReceipt | undefined {
    return this.vm.getTransactionReceipt(transactionHash)
  }

  async getLogs (filter: FilterRequest): Promise<RpcLogObject[]> {
    throw unsupportedOperation('getLogs')
  }

  private parseTx (signedTransaction: HexData): TransactionEvent {
    const tx = new Transaction(signedTransaction, { common: this.vm.vm._common })

    return {
      to: tx.to?.length > 0 ? bufferToAddress(tx.to) : undefined,
      from: bufferToAddress((tx as any).from),
      data: tx.data?.length > 0 ? bufferToHexData(tx.data) : undefined,
    }
  }

  private filters: Filter[] = []
  async createNewBlockFilter (): Promise<Quantity> {
    const currentId = numberToQuantity(this.filters.length)

    const block = await this.vm.getLatestBlock()
    this.filters.push({ type: 'block', lastSeenBlock: quantityToNumber(block.number) })

    return currentId
  }

  async getFilterChanges (id: Quantity) {
    const filter = this.filters[quantityToNumber(id)]
    if (!filter) {
      throw new Error(`Filter with ${id} doesnt exist`)
    }

    assert(filter.type === 'block')

    const latestBlockNumber = quantityToNumber(await this.vm.getBlockNumber())

    const newBlockHashes: Hash[] = []
    for (let i = filter.lastSeenBlock; i <= latestBlockNumber; i++) {
      const block = await this.vm.getBlock(numberToQuantity(i))
      newBlockHashes.push(block.hash)
    }

    return newBlockHashes
  }
}

interface Filter {
  type: 'block',
  lastSeenBlock: number,
}
