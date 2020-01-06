import { TestProvider } from '../TestProvider'
import { TestChain } from '../TestChain'

export interface NodeCtx {
  chain: TestChain,
  provider: TestProvider,
}

export function makeDefaultCtx (): NodeCtx {
  const chain = new TestChain()

  return {
    chain,
    provider: new TestProvider(chain),
  }
}
