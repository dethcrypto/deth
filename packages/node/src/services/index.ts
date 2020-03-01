import { Config } from '../config'
import { FileSystem } from './fs/FileSystem'
import { RealFileSystem } from './fs/RealFileSystem'
import { AbiDecoder } from './AbiDecoder'
import { DethLogger } from './logger/DethLogger'
import { CliLogger } from './logger/CliLogger'
import { createChain } from './chain'
import { WalletManager } from './WalletManager'
import { createRpcExecutor } from './rpcExecutor'
import { Explorer } from './Explorer'

export type Services = ReturnType<typeof createServices>

interface ServiceOverrides {
  fileSystem?: FileSystem,
  logger?: DethLogger,
}

export function createServices (config: Config, overrides?: ServiceOverrides) {
  const fileSystem = overrides?.fileSystem ?? new RealFileSystem()
  const abiDecoder = new AbiDecoder(fileSystem)
  const logger = overrides?.logger ?? new CliLogger(abiDecoder)
  const chain = createChain(logger, config.blockchain)
  const walletManager = new WalletManager(config.blockchain.accounts.privateKeys)
  const rpcExecutor = createRpcExecutor(chain, config.blockchain, walletManager)
  const explorer = new Explorer(chain)

  return {
    fileSystem,
    abiDecoder,
    logger,
    chain,
    walletManager,
    rpcExecutor,
    explorer,
  }
}

export async function initServices (services: Services, config: Config) {
  if (config.debugger.abiFilesGlob) {
    services.abiDecoder.loadAbis(config.debugger.abiFilesGlob, config.cwd)
  }
  await services.chain.init()
  services.logger.logNodeInfo(services.walletManager)
}
