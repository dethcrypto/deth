import Block, { BlockHeaderData } from 'ethereumjs-block'
import VM from 'ethereumts-vm'
import { Transaction } from 'ethereumjs-tx'
import BN from 'bn.js'
import { toBuffer } from 'ethereumjs-util'
import { ChainOptions } from '../ChainOptions'
import { getLatestBlock } from './getLatestBlock'

export async function getNextBlock (
  vm: VM,
  transactions: Transaction[],
  options: ChainOptions,
  clockSkew: number,
): Promise<Block> {
  const block = await getEmptyNextBlock(vm, options, clockSkew)
  await addTransactionsToBlock(block, transactions)
  return block
}

async function getEmptyNextBlock (vm: VM, options: ChainOptions, clockSkew: number) {
  const latestBlock = await getLatestBlock(vm)

  const header: BlockHeaderData = {
    gasLimit: options.blockGasLimit,
    nonce: 42,
    timestamp: Math.floor(Date.now() / 1000) + clockSkew,
    number: new BN(latestBlock.header.number).addn(1),
    parentHash: latestBlock.hash(),
    coinbase: options.coinbaseAddress,
  }
  const block = new Block({ header }, { common: vm._common })
  block.validate = (blockchain, cb) => cb(null)
  block.header.difficulty = toBuffer(block.header.canonicalDifficulty(latestBlock))

  return block
}

async function addTransactionsToBlock (block: Block, transactions: Transaction[]) {
  block.transactions.push(...transactions)
  await new Promise<void>((resolve, reject) => {
    block.genTxTrie(err => err != null ? reject(err) : resolve())
  })
  block.header.transactionsTrie = block.txTrie.root
}
