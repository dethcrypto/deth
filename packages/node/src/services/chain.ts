import { DethLogger } from './logger/DethLogger'
import { eventLogger, revertLogger } from './logger/stepsLoggers'
import { ChainOptions, Chain } from '@dethnode/chain'

export function createChain (logger: DethLogger, options: ChainOptions) {
  const chain = new Chain(options)
  chain.onVmStep(eventLogger(logger))
  chain.onVmStep(revertLogger(logger))
  chain.onTransaction(tx => logger.logTransaction(tx))
  return chain
}
