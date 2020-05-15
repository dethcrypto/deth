import VM from 'ethereumts-vm'
import { Transaction } from 'ethereumjs-tx'
// eslint-disable-next-line no-restricted-imports
import { RunTxResult } from 'ethereumts-vm/dist/runTx'
import { getNextBlock } from './getNextBlock'
import { ChainOptions } from '../ChainOptions'
import { DethBlockchain } from './storage/DethBlockchain'

export async function runIsolatedTransaction (
  vm: VM,
  blockchain: DethBlockchain,
  transaction: Transaction,
  options: ChainOptions,
  clockSkew: number,
): Promise<RunTxResult> {
  const psm = vm.pStateManager
  const initialStateRoot = await psm.getStateRoot()

  try {
    const block = await getNextBlock(vm, blockchain, [transaction], options, clockSkew)
    const result = await vm.runTx({
      block,
      tx: transaction,
      skipNonce: options.skipNonceCheck,
      skipBalance: options.skipBalanceCheck,
    })
    return result
  } finally {
    await psm.setStateRoot(initialStateRoot)
  }
}
