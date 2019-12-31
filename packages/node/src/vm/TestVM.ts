import VM from 'ethereumjs-vm'
import Block from 'ethereumjs-block'
import { BN, toBuffer, bufferToHex, bufferToInt } from 'ethereumjs-util'
import { Transaction } from 'ethereumjs-tx'
import { utils } from 'ethers'
import {
  Hash,
  HexString,
  Address,
  TransactionReceiptResponse,
  TransactionResponse,
  TransactionReceiptLogResponse,
} from '../model'
import { TestChainOptions } from '../TestChainOptions'
import { NETWORK_ID } from '../constants'
import { bufferToAddress, bufferToMaybeAddress, bufferToHexString, bufferToHash } from '../utils'
import { initializeVM } from './initializeVM'
import { getLatestBlock } from './getLatestBlock'
import { getNextBlock } from './getNextBlock'

/**
 * TestVM is a wrapper around ethereumjs-vm. It provides a promise-based
 * interface and abstracts away weird ethereumjs specific details
 */
export class TestVM {
  private vm?: Promise<VM>
  pendingTransactions: Transaction[] = []
  transactions: Map<Hash, TransactionResponse> = new Map()
  receipts: Map<Hash, TransactionReceiptResponse> = new Map()

  constructor (private options: TestChainOptions) {
  }

  private async getVM () {
    this.vm = this.vm ?? initializeVM(this.options)
    return this.vm
  }

  async getLatestBlock (): Promise<Block> {
    const vm = await this.getVM()
    return getLatestBlock(vm)
  }

  async addPendingTransaction (signedTransaction: HexString): Promise<Hash> {
    const vm = await this.getVM()
    const transaction = new Transaction(signedTransaction, { common: vm._common })
    this.pendingTransactions.push(transaction)
    return bufferToHash(transaction.hash())
  }

  async mineBlock () {
    const transactions = this.pendingTransactions
    this.pendingTransactions = []
    const vm = await this.getVM()
    const block = await getNextBlock(vm, transactions, this.options)

    const { results } = await vm.runBlock({
      block,
      generate: true,
      skipBlockValidation: true,
    })
    await new Promise((resolve, reject) => {
      vm.blockchain.putBlock(block, (err: unknown, block: Block) =>
        err != null ? reject(err) : resolve(block),
      )
    })

    this.rememberTransactions(block, transactions, results)
  }

  private rememberTransactions (
    block: Block,
    transactions: Transaction[],
    results: any[],
  ) {
    const blockHash = bufferToHash(block.hash())
    const blockNumber = bufferToInt(block.header.number)

    let cumulativeGasUsed = utils.bigNumberify(0)

    for (let i = 0; i < transactions.length; i++) {
      const tx = transactions[i]
      const result = results[i]
      const hash = bufferToHash(tx.hash())

      const from = bufferToAddress(tx.getSenderAddress())
      const to = bufferToMaybeAddress(tx.to)
      const created = bufferToMaybeAddress(result.createdAddress)

      const gasUsed = utils.bigNumberify(bufferToInt(result.gasUsed))
      cumulativeGasUsed = cumulativeGasUsed.add(gasUsed)

      const response: TransactionResponse = {
        hash,
        blockHash,
        blockNumber,
        transactionIndex: i,
        from,
        gasPrice: utils.bigNumberify(tx.gasPrice),
        gasLimit: utils.bigNumberify(tx.gasLimit),
        to,
        value: utils.bigNumberify(tx.value),
        nonce: bufferToInt(tx.nonce),
        data: bufferToHexString(tx.data),
        r: bufferToHexString(tx.r),
        s: bufferToHexString(tx.s),
        v: bufferToInt(tx.v),
        creates: created,
        networkId: NETWORK_ID,
      }

      // result.execResult.logs // TODO: correct format
      const logs: TransactionReceiptLogResponse[] = []

      const receipt: TransactionReceiptResponse = {
        blockHash,
        blockNumber,
        cumulativeGasUsed,
        gasUsed,
        logs,
        transactionHash: hash,
        transactionIndex: i,
        contractAddress: created,
        from,
        to,
        logsBloom: bufferToHexString(result.bloom.bitvector),
        root: undefined, // TODO: this
        status: 1, // TODO: this
      }

      this.transactions.set(hash, response)
      this.receipts.set(hash, receipt)
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
    const psm = vm.pStateManager
    const initialStateRoot = await psm.getStateRoot()

    try {
      const block = await getNextBlock(vm, [transaction], this.options)
      const result = await vm.runTx({
        block,
        tx: transaction,
        skipNonce: true,
        skipBalance: true,
      })
      return result
    } finally {
      await psm.setStateRoot(initialStateRoot)
    }
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

