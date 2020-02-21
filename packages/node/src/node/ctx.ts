import { TestChain } from '../TestChain'
import { WalletManager } from '../WalletManager'
import { getOptionsWithDefaults, TestChainOptions } from '../TestChainOptions'
import { RealFileSystem } from '../fs/RealFileSystem'
import { AbiDecoder } from '../debugger/AbiDecoder'
import { CliLogger } from '../debugger/Logger/CliLogger'
import { DethLogger } from '../debugger/Logger/DethLogger'

export interface NodeCtx {
  chain: TestChain,
  walletManager: WalletManager,
  options: TestChainOptions,
  abiDecoder: AbiDecoder,
  logger: DethLogger,
}

export async function makeDefaultCtx (options: TestChainOptions = getOptionsWithDefaults()): Promise<NodeCtx> {
  const abiDecoder = new AbiDecoder(new RealFileSystem())
  if (options.abiFilesGlob) {
    abiDecoder.loadAbis(options.abiFilesGlob, options.cwd)
  }

  const logger = new CliLogger(abiDecoder)

  const chain = new TestChain(logger, options)

  await chain.init()

  return {
    chain,
    walletManager: new WalletManager(chain.options.value.privateKeys),
    abiDecoder,
    logger,
    options,
  }
}
