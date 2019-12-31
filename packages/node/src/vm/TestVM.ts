import VM from 'ethereumjs-vm'
import Block from 'ethereumjs-block'
import { BN, toBuffer, bufferToHex } from 'ethereumjs-util'
import { Transaction } from 'ethereumjs-tx'
import { RpcTransactionReceipt, RpcTransactionResponse } from '../model'
import { TestChainOptions } from '../TestChainOptions'
import { Hash, Address, bufferToHash, Quantity, bufferToQuantity, HexData } from '../primitives'
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

  async getLatestBlock (): Promise<Block> {
    const vm = await this.getVM()
    return getLatestBlock(vm)
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

  async getAccount (address: Address) {
    const vm = await this.getVM()
    const psm = vm.pStateManager
    const account = await psm.getAccount(toBuffer(address))
    return account
  }

  async getCode (address: Address) {
    const vm = await this.getVM()
    const psm = vm.pStateManager
    const code = await psm.getContractCode(toBuffer(address))
    return bufferToHex(code)
  }

  async runIsolatedTransaction (transaction: Transaction) {
    const vm = await this.getVM()
    return runIsolatedTransaction(vm, transaction, this.options)
  }

  async getBlock (hashOrNumber: string): Promise<Block> {
    const vm = await this.getVM()
    const query = hashOrNumber.length === 66
      ? toBuffer(hashOrNumber)
      : new BN(hashOrNumber.substr(2), 'hex')
    return new Promise((resolve, reject) => {
      vm.blockchain.getBlock(query, (err: unknown, block: Block) =>
        err != null ? reject(err) : resolve(block),
      )
    })
  }
}
