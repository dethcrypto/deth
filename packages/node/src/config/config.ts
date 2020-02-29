import { TestChainOptions, DEFAULT_OPTIONS } from '@deth/chain'
import { Path, makePath } from '../fs/Path'
import { DeepPartial } from 'ts-essentials'
import { merge } from 'lodash'

export type NodeConfig = {
  blockchain: TestChainOptions,
  debugger: {
    abiFilesGlob?: string,
  },
  cwd: Path, // config's directory if it was provided
}

export const DEFAULT_NODE_CONFIG: NodeConfig = {
  blockchain: DEFAULT_OPTIONS,
  debugger: {
    abiFilesGlob: undefined,
  },
  cwd: makePath(process.cwd()),
}

export function getConfigWithDefaults (options: DeepPartial<NodeConfig> = {}): NodeConfig {
  return merge({}, DEFAULT_NODE_CONFIG, options)
}
