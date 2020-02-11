import { TestChain } from '../TestChain'
import { WalletManager } from '../WalletManager'
import { getOptionsWithDefaults, TestChainOptions } from '../TestChainOptions'

export interface NodeCtx {
  chain: TestChain,
  walletManager: WalletManager,
  options: TestChainOptions,
}

export async function makeDefaultCtx (options: TestChainOptions = getOptionsWithDefaults()): Promise<NodeCtx> {
  const chain = new TestChain(options)
  await chain.init()

  return {
    chain,
    walletManager: new WalletManager(chain.options.value.privateKeys),
    options,
  }
}
