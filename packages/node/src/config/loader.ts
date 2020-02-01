import { FileSystem } from '../fs/FileSystem'
import { Path } from '../fs/Path'
import { getOptionsWithDefaults } from '../TestChainOptions'

/**
 * Loads config from a directory
 * TODO:
 * - support autofinding file based only on dir path
 * - support at least JSON/JS/TS
 * - typecheck config with iots
 * - load BN values as strings in JSON
 */
export function loadConfig (fs: FileSystem, path: Path) {
  const exists = fs.fileExists(path)

  if (!exists) {
    throw new Error(`Couldn't load config at ${path}`)
  }

  // @todo parse / typecheck config. We can utilize io-ts for that
  const parsedConfig = JSON.parse(fs.readFile(path))

  return getOptionsWithDefaults(parsedConfig)
}
