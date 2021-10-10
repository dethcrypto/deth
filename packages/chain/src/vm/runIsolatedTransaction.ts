import VM from '@ethereumjs/vm'
import { Transaction } from '@ethereumjs/tx'
// eslint-disable-next-line no-restricted-imports
import { RunTxResult } from '@ethereumjs/vm/dist/runTx'
import { getNextBlock } from './getNextBlock'
import { ChainOptions } from '../ChainOptions'

export async function runIsolatedTransaction(
  vm: VM,
  transaction: Transaction,
  options: ChainOptions,
  clockSkew: number
): Promise<RunTxResult> {
  const psm = vm.pStateManager
  const initialStateRoot = await psm.getStateRoot()

  try {
    const block = await getNextBlock(vm, [transaction], options, clockSkew)
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
