import VM from 'ethereumjs-vm'
import Block from 'ethereumjs-block'
import { BN, toBuffer } from 'ethereumjs-util'
import { Transaction } from 'ethereumjs-tx'
import { RpcTransactionReceipt, RpcTransactionResponse, RpcBlockResponse, toBlockResponse } from '../model'
import { TestChainOptions } from '../TestChainOptions'
import { Hash, Address, bufferToHash, Quantity, bufferToQuantity, HexData, bufferToHexData } from '../primitives'
import { initializeVM } from './initializeVM'
import { getLatestBlock } from './getLatestBlock'
import { putBlock } from './putBlock'
import { runIsolatedTransaction } from './runIsolatedTransaction'
import { DethStateManger } from './storage/DethStateManger'
import { DethBlockchain } from './storage/DethBlockchain'
import { assert } from 'ts-essentials'
// eslint-disable-next-line
import PStateManager from 'ethereumjs-vm/dist/state/promisified'
import { BlockchainAdapter } from './storage/BlockchainAdapter'
import { StateManagerAdapter } from './storage/StateManagerAdapter'

interface VMSnapshot {
  blockchain: DethBlockchain,
  stateManager: DethStateManger,
}

/**
 * TestVM is a wrapper around ethereumjs-vm. It provides a promise-based
 * interface and abstracts away weird ethereumjs specific details
 */
export class TestVM {
  private vm!: VM
  private stateManger!: DethStateManger
  private blockchain!: DethBlockchain

  pendingTransactions: Transaction[] = []
  transactions: Map<Hash, RpcTransactionResponse> = new Map()
  receipts: Map<Hash, RpcTransactionReceipt> = new Map()
  snapshots: VMSnapshot[] = []

  constructor (private options: TestChainOptions) {}

  async init () {
    this.stateManger = new DethStateManger()
    this.blockchain = new DethBlockchain()
    this.vm = await initializeVM(this.options, this.stateManger, this.blockchain)
  }

  // @todo this requires better typings (whole step hooks mechanism)
  installStepHook (hook: Function) {
    this.vm.on('step', hook)
  }

  makeSnapshot (): number {
    const snapshotId = this.snapshots.length

    const snapshot = {
      blockchain: this.blockchain.copy(),
      stateManager: this.stateManger.copy(),
    }

    this.snapshots.push(snapshot)

    return snapshotId
  }

  revertToSnapshot (id: number) {
    const snapshot = this.snapshots[id]
    assert(snapshot, `Snapshot ${id} doesn't exist`)

    this.blockchain = snapshot.blockchain
    this.stateManger = snapshot.stateManager
    this.hotswapStateStorageForVm()
  }

  // change internals of VM to point to new blockchain and state machine
  private hotswapStateStorageForVm () {
    const blockchainAdapter = new BlockchainAdapter(this.blockchain)
    ;(this.vm as any).blockchain = blockchainAdapter

    const stateManagerAdapter = new StateManagerAdapter(this.stateManger)
    ;(this.vm as any).stateManager = stateManagerAdapter
    ;(this.vm as any).pStateManager = new PStateManager(stateManagerAdapter as any)
  }

  async getBlockNumber (): Promise<Quantity> {
    const block = await getLatestBlock(this.vm)
    return bufferToQuantity(block.header.number)
  }

  async getLatestBlock (): Promise<RpcBlockResponse> {
    const block = await getLatestBlock(this.vm)
    return toBlockResponse(block)
  }

  async addPendingTransaction (signedTransaction: HexData): Promise<Hash> {
    const transaction = new Transaction(signedTransaction, { common: this.vm._common })
    this.pendingTransactions.push(transaction)
    return bufferToHash(transaction.hash())
  }

  async mineBlock (clockSkew: number) {
    const transactions = this.pendingTransactions
    this.pendingTransactions = []

    const { receipts, responses } = await putBlock(this.vm, transactions, this.options, clockSkew)

    for (const receipt of receipts) {
      this.receipts.set(receipt.transactionHash, receipt)
    }
    for (const response of responses) {
      this.transactions.set(response.hash, response)
    }
  }

  getTransaction (hash: Hash) {
    return this.transactions.get(hash)
  }

  getTransactionReceipt (hash: Hash) {
    return this.receipts.get(hash)
  }

  async getNonce (address: Address) {
    const account = await this.getAccount(address)
    return bufferToQuantity(account.nonce)
  }

  async getBalance (address: Address) {
    const account = await this.getAccount(address)
    return bufferToQuantity(account.balance)
  }

  private async getAccount (address: Address) {
    return this.stateManger.getAccount(address)
  }

  async getCode (address: Address) {
    const code = this.stateManger.getContractCode(address)
    return bufferToHexData(code)
  }

  async runIsolatedTransaction (transaction: Transaction, clockSkew: number) {
    return runIsolatedTransaction(this.vm, transaction, this.options, clockSkew)
  }

  async getBlock (hashOrNumber: string): Promise<RpcBlockResponse> {
    const query = hashOrNumber.length === 66 ? toBuffer(hashOrNumber) : new BN(hashOrNumber.substr(2), 'hex')
    const block = await new Promise<Block>((resolve, reject) => {
      this.vm.blockchain.getBlock(query, (err: unknown, block: Block) => (err != null ? reject(err) : resolve(block)))
    })
    return toBlockResponse(block)
  }
}
