import { Hardfork } from '../../src/model'
import { utils } from 'ethers'
import { ChainOptions, getChainOptionsWithDefaults } from '../../src/ChainOptions'
import BN from 'bn.js'
import { DeepPartial } from 'ts-essentials'

export interface TestProviderOptions {
  hardfork?: Hardfork,
  privateKeys?: string[],
  initialBalance?: utils.BigNumber,
  blockGasLimit?: utils.BigNumber,
  defaultGasPrice?: utils.BigNumber,
  coinbaseAddress?: string,
}

export function toTestChainOptions (options: TestProviderOptions = {}): ChainOptions {
  const result: DeepPartial<ChainOptions> = {}

  if (options.hardfork) {
    result.hardfork = options.hardfork
  }
  if (options.privateKeys) {
    result.accounts = result.accounts ?? {}
    result.accounts.privateKeys = options.privateKeys
  }
  if (options.initialBalance) {
    result.accounts = result.accounts ?? {}
    result.accounts.initialBalance = toBN(options.initialBalance)
  }
  if (options.blockGasLimit) {
    result.blockGasLimit = toBN(options.blockGasLimit)
  }
  if (options.defaultGasPrice) {
    result.defaultGasPrice = toBN(options.defaultGasPrice)
  }
  if (options.coinbaseAddress) {
    result.coinbaseAddress = options.coinbaseAddress
  }

  return getChainOptionsWithDefaults(result)
}

function toBN (bigNumber: utils.BigNumber) {
  return new BN(bigNumber.toString())
}
