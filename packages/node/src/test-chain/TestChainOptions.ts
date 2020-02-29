import { Hardfork } from '../model'
import BN from 'bn.js'
import { NodeConfig, DEFAULT_NODE_CONFIG } from '../config/config'
import { merge } from 'lodash'
import { DeepPartial } from 'ts-essentials'

export interface TestChainOptions {
  hardfork: Hardfork,
  blockGasLimit: BN,
  defaultGasPrice: BN,
  coinbaseAddress: string,
  chainId: number,
  chainName: string,
  clockSkew: number,
  autoMining: boolean,
  skipNonceCheck: boolean,
  skipBalanceCheck: boolean,

  accounts: {
    privateKeys: string[],
    initialBalance: BN,
  },
}

export function getTestChainOptionsFromConfig (config: NodeConfig): TestChainOptions {
  return {
    ...config.blockchain,
    accounts: config.accounts,
  }
}

export function getTestChainOptionsWithDefaults (options: DeepPartial<TestChainOptions> = {}): TestChainOptions {
  return merge({}, getTestChainOptionsFromConfig(DEFAULT_NODE_CONFIG), options)
}
