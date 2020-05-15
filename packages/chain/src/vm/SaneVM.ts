import VM from 'ethereumts-vm'
import { Transaction } from 'ethereumjs-tx'
import { RpcBlockResponse, toBlockResponse } from '../model'
import { ChainOptions } from '../ChainOptions'
import { Hash, Address, bufferToHash, Quantity, bufferToQuantity, HexData, bufferToHexData } from '../model'
import { initializeVM } from './initializeVM'
import { putBlock } from './putBlock'
import { runIsolatedTransaction } from './runIsolatedTransaction'
import { DethStateManger } from './storage/DethStateManger'
import { DethBlockchain } from './storage/DethBlockchain'
// eslint-disable-next-line no-restricted-imports
import PStateManager from 'ethereumts-vm/dist/state/promisified'
// eslint-disable-next-line no-restricted-imports
import { InterpreterStep } from 'ethereumts-vm/dist/evm/interpreter'
import { BlockchainAdapter } from './storage/BlockchainAdapter'
import { StateManagerAdapter } from './storage/StateManagerAdapter'
import { Snapshot } from '../utils/Snapshot'
import { assert } from 'ts-essentials'

interface VMSnapshot {
  blockchain: DethBlockchain,
  stateManager: DethStateManger,
}

/**
 * SaneVM is a wrapper around ethereumts-vm (our fork). It provides a promise-based
 * interface and abstracts away weird ethereumjs specific details
 */
export class SaneVM {
  vm!: VM
  state: Snapshot<{ stateManger: DethStateManger, blockchain: DethBlockchain }>
  pendingTransactions: Transaction[] = []
  snapshots: VMSnapshot[] = []

  constructor (private options: ChainOptions) {
    this.state = new Snapshot(
      {
        stateManger: new DethStateManger(),
        blockchain: new DethBlockchain(),
      },
      t => ({
        blockchain: t.blockchain.copy(),
        stateManger: t.stateManger.copy(),
      }),
    )
  }

  async init () {
    this.vm = await initializeVM(this.options, this.state.value.stateManger, this.state.value.blockchain)
  }

  installStepHook (listener: (runState: InterpreterStep) => void) {
    this.vm.on('step', listener)
  }

  makeSnapshot (): number {
    return this.state.save()
  }

  revertToSnapshot (id: number) {
    this.state.revert(id)
    this.hotswapStateStorageForVm()
  }

  // change internals of VM to point to new blockchain and state machine
  private hotswapStateStorageForVm () {
    const blockchainAdapter = new BlockchainAdapter(this.state.value.blockchain)
    ;(this.vm as any).blockchain = blockchainAdapter

    const stateManagerAdapter = new StateManagerAdapter(this.state.value.stateManger)
    ;(this.vm as any).stateManager = stateManagerAdapter
    ;(this.vm as any).pStateManager = new PStateManager(stateManagerAdapter as any)
  }

  getBlockNumber (): Quantity {
    const block = this.state.value.blockchain.getLatestBlock()
    assert(block, 'Blockchain is empty (no genesis block was generated)')

    return bufferToQuantity(block.header.number)
  }

  getLatestBlock (): RpcBlockResponse {
    const block = this.state.value.blockchain.getLatestBlock()
    assert(block, 'Blockchain is empty (no genesis block was generated)')

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

    await putBlock(this.vm, this.state.value.blockchain, transactions, this.options, clockSkew)
  }

  getTransaction (hash: Hash) {
    return this.state.value.blockchain.getTransaction(hash)
  }

  getTransactionReceipt (hash: Hash) {
    return this.state.value.blockchain.getTransactionReceipt(hash)
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
    return this.state.value.stateManger.getAccount(address)
  }

  async getCode (address: Address) {
    const code = this.state.value.stateManger.getContractCode(address)
    return bufferToHexData(code)
  }

  async runIsolatedTransaction (transaction: Transaction, clockSkew: number) {
    return runIsolatedTransaction(this.vm, this.state.value.blockchain, transaction, this.options, clockSkew)
  }

  async getBlock (hashOrNumber: Quantity | Hash): Promise<RpcBlockResponse> {
    return toBlockResponse(this.state.value.blockchain.getBlock(hashOrNumber))
  }
}
