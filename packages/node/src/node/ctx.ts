import { TestChain } from '../TestChain'
import { WalletManager } from '../WalletManager'

export interface NodeCtx {
  chain: TestChain,
  walletManager: WalletManager,
}

export async function makeDefaultCtx (): Promise<NodeCtx> {
  const chain = new TestChain()
  await chain.init()

  return {
    chain,
    walletManager: new WalletManager(chain.options.privateKeys),
  }
}
