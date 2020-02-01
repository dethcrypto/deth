import { TestChain } from '../TestChain'
import { WalletManager } from '../WalletManager'
import { getOptionsWithDefaults, TestChainOptions } from '../TestChainOptions'

export interface NodeCtx {
  chain: TestChain,
  walletManager: WalletManager,
  options: TestChainOptions,
}

export async function makeDefaultCtx (): Promise<NodeCtx> {
  const chain = new TestChain()
  await chain.init()
  const options = getOptionsWithDefaults()

  return {
    chain,
    walletManager: new WalletManager(chain.options.privateKeys),
    options,
  }
}
