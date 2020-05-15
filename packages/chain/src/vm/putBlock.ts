import VM from 'ethereumts-vm'
import Block from 'ethereumjs-block'
import { Transaction } from 'ethereumjs-tx'
import { ChainOptions } from '../ChainOptions'
import { getNextBlock } from './getNextBlock'
import { getReceiptsAndResponses } from './getReceiptsAndResponses'
import { DethBlockchain } from './storage/DethBlockchain'

export async function putBlock (
  vm: VM,
  blockchain: DethBlockchain,
  transactions: Transaction[],
  options: ChainOptions,
  clockSkew: number,
) {
  const block = await getNextBlock(vm, blockchain, transactions, options, clockSkew)

  const { results } = await vm.runBlock({
    block,
    generate: true,
    skipBlockValidation: true,
    skipNonce: options.skipNonceCheck,
    skipBalance: options.skipBalanceCheck,
  })
  await new Promise((resolve, reject) => {
    vm.blockchain.putBlock(block, (err: unknown, block: Block) => (err != null ? reject(err) : resolve(block)))
  })

  const { receipts, responses } = getReceiptsAndResponses(block, transactions, results)

  blockchain.addReceipts(receipts)
  blockchain.addTransactions(responses)

  return { receipts, responses }
}
