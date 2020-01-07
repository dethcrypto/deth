import { TestChain } from '../TestChain'
import { WalletManager } from '../WalletManager'

export interface NodeCtx {
  chain: TestChain,
  walletManager: WalletManager,
}

export function makeDefaultCtx (): NodeCtx {
  const chain = new TestChain()

  return {
    chain,
    walletManager: new WalletManager(chain.options.privateKeys),
  }
}
