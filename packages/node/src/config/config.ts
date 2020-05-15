import { ChainOptions, DEFAULT_CHAIN_OPTIONS } from '@ethereum-ts/chain'
import { Path, makePath } from '../services/fs/Path'
import { DeepPartial } from 'ts-essentials'
import { merge } from 'lodash'

export type Config = {
  port: number,
  blockchain: ChainOptions,
  debugger: {
    abiFilesGlob?: string,
  },
  cwd: Path, // config's directory if it was provided
  fakeHistory: boolean,
}

export const DEFAULT_CONFIG: Config = {
  port: 8545,
  blockchain: DEFAULT_CHAIN_OPTIONS,
  debugger: {
    abiFilesGlob: undefined,
  },
  cwd: makePath(process.cwd()),
  fakeHistory: false,
}

export function getConfigWithDefaults (options: DeepPartial<Config> = {}): Config {
  return merge({}, DEFAULT_CONFIG, options)
}
