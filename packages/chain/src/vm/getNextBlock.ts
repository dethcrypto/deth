import Block, { BlockHeaderData } from 'ethereumjs-block'
import VM from 'ethereumts-vm'
import { Transaction } from 'ethereumjs-tx'
import BN from 'bn.js'
import { toBuffer } from 'ethereumjs-util'
import { ChainOptions } from '../ChainOptions'
import { assert } from 'ts-essentials'
import { DethBlockchain } from './storage/DethBlockchain'

export async function getNextBlock (
  vm: VM,
  blockchain: DethBlockchain,
  transactions: Transaction[],
  options: ChainOptions,
  clockSkew: number,
): Promise<Block> {
  const block = await getEmptyNextBlock(vm, blockchain, options, clockSkew)
  await addTransactionsToBlock(block, transactions)
  return block
}

async function getEmptyNextBlock (vm: VM, blockchain: DethBlockchain, options: ChainOptions, clockSkew: number) {
  const latestBlock = blockchain.getLatestBlock()
  assert(latestBlock, 'Blockchain is empty (no genesis block was generated)')

  const header: BlockHeaderData = {
    gasLimit: options.blockGasLimit,
    nonce: 42,
    timestamp: Math.floor(Date.now() / 1000) + clockSkew,
    number: new BN(latestBlock.header.number).addn(1),
    parentHash: latestBlock.hash(),
    coinbase: options.coinbaseAddress,
  }
  const block = new Block({ header }, { common: vm._common })
  block.validate = (_blockchain, cb) => cb(null)
  block.header.difficulty = toBuffer(block.header.canonicalDifficulty(latestBlock))

  return block
}

async function addTransactionsToBlock (block: Block, transactions: Transaction[]) {
  block.transactions.push(...transactions)
  await new Promise((resolve, reject) => {
    block.genTxTrie(err => (err != null ? reject(err) : resolve()))
  })
  block.header.transactionsTrie = block.txTrie.root
}
