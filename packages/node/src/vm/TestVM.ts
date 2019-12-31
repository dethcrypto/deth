import VM from 'ethereumjs-vm'
import Block from 'ethereumjs-block'
import { BN, toBuffer } from 'ethereumjs-util'
import { Transaction } from 'ethereumjs-tx'
import {
  RpcTransactionReceipt,
  RpcTransactionResponse,
  RpcBlockResponse,
  toBlockResponse,
} from '../model'
import { TestChainOptions } from '../TestChainOptions'
import {
  Hash,
  Address,
  bufferToHash,
  Quantity,
  bufferToQuantity,
  HexData,
  bufferToHexData,
} from '../primitives'
import { initializeVM } from './initializeVM'
import { getLatestBlock } from './getLatestBlock'
import { putBlock } from './putBlock'
import { runIsolatedTransaction } from './runIsolatedTransaction'

/**
 * TestVM is a wrapper around ethereumjs-vm. It provides a promise-based
 * interface and abstracts away weird ethereumjs specific details
 */
export class TestVM {
  private vm?: Promise<VM>
  pendingTransactions: Transaction[] = []
  transactions: Map<Hash, RpcTransactionResponse> = new Map()
  receipts: Map<Hash, RpcTransactionReceipt> = new Map()

  constructor (private options: TestChainOptions) {
  }

  private async getVM () {
    this.vm = this.vm ?? initializeVM(this.options)
    return this.vm
  }

  async getBlockNumber (): Promise<Quantity> {
    const vm = await this.getVM()
    const block = await getLatestBlock(vm)
    return bufferToQuantity(block.header.number)
  }

  async getLatestBlock (): Promise<RpcBlockResponse> {
    const vm = await this.getVM()
    const block = await getLatestBlock(vm)
    return toBlockResponse(block)
  }

  async addPendingTransaction (signedTransaction: HexData): Promise<Hash> {
    const vm = await this.getVM()
    const transaction = new Transaction(signedTransaction, { common: vm._common })
    this.pendingTransactions.push(transaction)
    return bufferToHash(transaction.hash())
  }

  async mineBlock () {
    const transactions = this.pendingTransactions
    this.pendingTransactions = []

    const vm = await this.getVM()
    const { receipts, responses } = await putBlock(vm, transactions, this.options)

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
    const vm = await this.getVM()
    return vm.pStateManager.getAccount(toBuffer(address))
  }

  async getCode (address: Address) {
    const vm = await this.getVM()
    const psm = vm.pStateManager
    const code = await psm.getContractCode(toBuffer(address))
    return bufferToHexData(code)
  }

  async runIsolatedTransaction (transaction: Transaction) {
    const vm = await this.getVM()
    return runIsolatedTransaction(vm, transaction, this.options)
  }

  async getBlock (hashOrNumber: string): Promise<RpcBlockResponse> {
    const vm = await this.getVM()
    const query = hashOrNumber.length === 66
      ? toBuffer(hashOrNumber)
      : new BN(hashOrNumber.substr(2), 'hex')
    const block = await new Promise<Block>((resolve, reject) => {
      vm.blockchain.getBlock(query, (err: unknown, block: Block) =>
        err != null ? reject(err) : resolve(block),
      )
    })
    return toBlockResponse(block)
  }
}
