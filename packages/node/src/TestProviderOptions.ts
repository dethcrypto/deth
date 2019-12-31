import { Hardfork } from "./model";
import { utils } from "ethers";
import { TestChainOptions, getOptionsWithDefaults } from "./TestChainOptions";
import BN from 'bn.js'

export interface TestProviderOptions {
  hardfork?: Hardfork,
  privateKeys?: string[],
  initialBalance?: utils.BigNumber,
  blockGasLimit?: utils.BigNumber,
  defaultGasPrice?: utils.BigNumber,
  coinbaseAddress?: string,
}

export function toTestChainOptions (options: TestProviderOptions = {}): TestChainOptions {
  const result: Partial<TestChainOptions> = {}
  if (options.hardfork) {
    result.hardfork = options.hardfork
  }
  if (options.privateKeys) {
    result.privateKeys = options.privateKeys
  }
  if (options.initialBalance) {
    result.initialBalance = toBN(options.initialBalance)
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
  return getOptionsWithDefaults(result)
}

function toBN (bigNumber: utils.BigNumber) {
  return new BN(bigNumber.toString())
}
