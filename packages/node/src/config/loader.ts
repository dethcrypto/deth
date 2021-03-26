import { FileSystem } from '../services/fs/FileSystem'
import { Path, getDirName } from '../services/fs/Path'
import { getConfigWithDefaults } from './config'

/**
 * Loads config from a directory
 * TODO:
 * - support autofinding file based only on dir path
 * - support at least JSON/JS/TS
 * - typecheck config with iots
 * - load BN values as strings in JSON
 */
export function loadConfig(fs: FileSystem, path: Path) {
  const exists = fs.fileExists(path)

  if (!exists) {
    throw new Error(`Couldn't load config at ${path}`)
  }

  // @todo parse / typecheck config. We can utilize io-ts for that
  const config = fs.requireFile(path)
  config.cwd = getDirName(path) // set cwd to config path

  return getConfigWithDefaults(config)
}
