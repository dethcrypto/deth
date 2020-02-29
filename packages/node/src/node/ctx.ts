import { TestChain } from '../test-chain/TestChain'
import { WalletManager } from '../WalletManager'
import { RealFileSystem } from '../fs/RealFileSystem'
import { AbiDecoder } from '../debugger/AbiDecoder'
import { CliLogger } from '../debugger/Logger/CliLogger'
import { DethLogger } from '../debugger/Logger/DethLogger'
import { NodeConfig, getConfigWithDefaults } from '../config/config'
import { getTestChainOptionsFromConfig } from '../test-chain/TestChainOptions'
import { eventLogger, revertLogger } from '../debugger/stepsLoggers'

export interface NodeCtx {
  chain: TestChain,
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

  const chain = new TestChain(getTestChainOptionsFromConfig(config))
  await chain.init()
  chain.onVmStep(eventLogger(logger))
  chain.onVmStep(revertLogger(logger))
  chain.onTransaction(tx => logger.logTransaction(tx))

  return {
    chain,
    walletManager: new WalletManager(config.accounts.privateKeys),
    abiDecoder,
    logger,
    cfg: config,
  }
}
