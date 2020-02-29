import { Chain } from '@deth/chain'
import { WalletManager } from './WalletManager'
import { RealFileSystem } from './fs/RealFileSystem'
import { AbiDecoder } from './debugger/AbiDecoder'
import { CliLogger } from './debugger/Logger/CliLogger'
import { DethLogger } from './debugger/Logger/DethLogger'
import { NodeConfig, getConfigWithDefaults } from './config/config'
import { eventLogger, revertLogger } from './debugger/stepsLoggers'

export interface NodeCtx {
  chain: Chain,
  walletManager: WalletManager,
  cfg: NodeConfig,
  abiDecoder: AbiDecoder,
  logger: DethLogger,
}

export async function makeDefaultCtx (_config: NodeConfig = getConfigWithDefaults()): Promise<NodeCtx> {
  const config = getConfigWithDefaults(_config)
  const abiDecoder = new AbiDecoder(new RealFileSystem())
  if (config.debugger.abiFilesGlob) {
    abiDecoder.loadAbis(config.debugger.abiFilesGlob, config.cwd)
  }

  const logger = new CliLogger(abiDecoder)

  const chain = new Chain(config.blockchain)
  await chain.init()
  chain.onVmStep(eventLogger(logger))
  chain.onVmStep(revertLogger(logger))
  chain.onTransaction(tx => logger.logTransaction(tx))

  return {
    chain,
    walletManager: new WalletManager(config.blockchain.accounts.privateKeys),
    abiDecoder,
    logger,
    cfg: config,
  }
}
