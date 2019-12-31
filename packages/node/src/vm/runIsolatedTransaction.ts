import VM from 'ethereumjs-vm'
import { Transaction } from 'ethereumjs-tx'
// eslint-disable-next-line no-restricted-imports
import { RunTxResult } from 'ethereumjs-vm/dist/runTx'
import { getNextBlock } from './getNextBlock'
import { TestChainOptions } from '../TestChainOptions'

export async function runIsolatedTransaction (
  vm: VM,
  transaction: Transaction,
  options: TestChainOptions,
): Promise<RunTxResult> {
  const psm = vm.pStateManager
  const initialStateRoot = await psm.getStateRoot()

  try {
    const block = await getNextBlock(vm, [transaction], options)
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
