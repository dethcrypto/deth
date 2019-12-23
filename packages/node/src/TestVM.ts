import VM from 'ethereumjs-vm'
import Blockchain from 'ethereumjs-blockchain'
import Block, { BlockHeaderData } from 'ethereumjs-block'
import { BN, toBuffer, bufferToHex, bufferToInt } from 'ethereumjs-util'
import { Transaction } from 'ethereumjs-tx'
import Account from 'ethereumjs-account'
import { Wallet, utils } from 'ethers'
import {
  Hash,
  HexString,
  Address,
  TransactionReceiptResponse,
  TransactionResponse,
  TransactionReceiptLogResponse,
} from './model'
import { TestChainOptions } from './TestChainOptions'
import Common from 'ethereumjs-common'
import { NETWORK_ID, CHAIN_ID, CHAIN_NAME } from './constants'
import { bufferToAddress, bufferToMaybeAddress } from './utils'

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

  async getCommon () {
    const vm = await this.getVM()
    return vm._common
  }

  async getLatestBlock (): Promise<Block> {
    const vm = await this.getVM()
    return new Promise((resolve, reject) => {
      vm.blockchain.getLatestBlock((err: unknown, block: Block) => {
        if (err) reject(err)
        resolve(block)
      })
    })
  }

  async addPendingTransaction (signedTransaction: HexString): Promise<Hash> {
    const transaction = new Transaction(signedTransaction, { common: await this.getCommon() })
    this.pendingTransactions.push(transaction)
    return bufferToHex(transaction.hash())
  }

  async mineBlock () {
    const transactions = this.pendingTransactions
    this.pendingTransactions = []
    const block = await this.getNextBlock(transactions)

    const vm = await this.getVM()
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
    const blockHash = bufferToHex(block.hash())
    const blockNumber = bufferToInt(block.header.number)

    let cumulativeGasUsed = utils.bigNumberify(0)

    for (let i = 0; i < transactions.length; i++) {
      const tx = transactions[i]
      const result = results[i]
      const hash = bufferToHex(tx.hash())

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
        data: bufferToHex(tx.data),
        r: bufferToHex(tx.r),
        s: bufferToHex(tx.s),
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
        logsBloom: bufferToHex(result.bloom.bitvector),
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

  private async getNextBlock (transactions: Transaction[]) {
    const block = await this.getEmptyNextBlock()
    await this.addTransactionsToBlock(block, transactions)
    return block
  }

  private async getEmptyNextBlock (): Promise<Block> {
    const latestBlock = await this.getLatestBlock()

    const header: BlockHeaderData = {
      gasLimit: this.options.blockGasLimit.toHexString(),
      nonce: 42,
      timestamp: Math.floor(Date.now() / 1000),
      number: new BN(latestBlock.header.number).addn(1),
      parentHash: latestBlock.hash(),
      coinbase: this.options.coinbaseAddress,
    }
    const block = new Block({ header }, { common: await this.getCommon() })
    block.validate = (blockchain, cb) => cb(null)
    block.header.difficulty = toBuffer(block.header.canonicalDifficulty(latestBlock))

    return block
  }

  private async addTransactionsToBlock (block: Block, transactions: Transaction[]) {
    block.transactions.push(...transactions)
    await new Promise((resolve, reject) => {
      block.genTxTrie(err => err != null ? reject(err) : resolve())
    })
    block.header.transactionsTrie = block.txTrie.root
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
      const block = await this.getNextBlock([transaction])
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

async function initializeVM (options: TestChainOptions) {
  const common = Common.forCustomChain('mainnet', {
    chainId: CHAIN_ID,
    networkId: NETWORK_ID,
    name: CHAIN_NAME,
  }, options.hardfork)
  const blockchain = new Blockchain({ common, validate: false })
  const vm = new VM({ common, blockchain })
  await initAccounts(vm, options)
  await addGenesisBlock(vm, options)
  return vm
}

async function initAccounts (vm: VM, options: TestChainOptions) {
  const psm = vm.pStateManager
  const balance = new BN(options.initialBalance.toString()).toBuffer()
  for (const privateKey of options.privateKeys) {
    const { address } = new Wallet(privateKey)
    await psm.putAccount(toBuffer(address), new Account({ balance }))
  }
}

async function addGenesisBlock (vm: VM, options: TestChainOptions) {
  const genesisBlock = new Block({
    header: {
      bloom: '0x' + '0'.repeat(512),
      coinbase: options.coinbaseAddress,
      gasLimit: options.blockGasLimit.toHexString(),
      gasUsed: '0x00',
      nonce: 0x42,
      extraData: '0x1337',
      number: 0,
      parentHash: '0x' + '0'.repeat(64),
      timestamp: 0,
    },
  }, { common: vm._common })

  await new Promise((resolve, reject) => {
    vm.blockchain.putGenesis(genesisBlock, (err: unknown) =>
      err != null ? reject(err) : resolve(),
    )
  })
}
