import VM from 'ethereumts-vm'
import Block from 'ethereumjs-block'
import { BN, toBuffer } from 'ethereumjs-util'
import { Transaction } from 'ethereumjs-tx'
import { RpcTransactionReceipt, RpcTransactionResponse, RpcBlockResponse, toBlockResponse } from '../model'
import { ChainOptions } from '../ChainOptions'
import { Hash, Address, bufferToHash, Quantity, bufferToQuantity, HexData, bufferToHexData } from '../model'
import { initializeVM } from './initializeVM'
import { getLatestBlock } from './getLatestBlock'
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
import { SnapshotObject } from './storage/SnapshotObject'

interface VMSnapshot {
  blockchain: DethBlockchain,
  stateManager: DethStateManger,
}

/**
 * TestVM is a wrapper around ethereumts-vm (our fork). It provides a promise-based
 * interface and abstracts away weird ethereumjs specific details
 */
export class TestVM {
  vm!: VM
  state: SnapshotObject<{ stateManger: DethStateManger, blockchain: DethBlockchain }>
  pendingTransactions: Transaction[] = []
  transactions: Map<Hash, RpcTransactionResponse> = new Map()
  receipts: Map<Hash, RpcTransactionReceipt> = new Map()
  snapshots: VMSnapshot[] = []

  constructor (private options: ChainOptions) {
    this.state = new SnapshotObject({
      stateManger: new DethStateManger(),
      blockchain: new DethBlockchain(),
    }, (t) => ({
      blockchain: t.blockchain.copy(),
      stateManger: t.stateManger.copy(),
    }))
  }

  async init () {
    this.vm = await initializeVM(this.options, this.state.value.stateManger, this.state.value.blockchain)
  }

  installStepHook (listener: (runState: InterpreterStep) => void) {
    this.vm.on('step', listener)
  }

  makeSnapshot (): number {
    return this.state.makeSnapshot()
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
    return this.state.value.stateManger.getAccount(address)
  }

  async getCode (address: Address) {
    const code = this.state.value.stateManger.getContractCode(address)
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
