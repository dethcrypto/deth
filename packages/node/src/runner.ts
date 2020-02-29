#!/usr/bin/env node
import { runNode } from './node'
import { Path, relativePathToPath } from './services/fs/Path'
import { loadConfig, getConfigWithDefaults } from './config'
import { RealFileSystem } from './services/fs/RealFileSystem'

const args = process.argv.slice(2)

const configPath = getConfigPathFromArgs(args)
const config = configPath
  ? loadConfig(new RealFileSystem(), configPath)
  : getConfigWithDefaults()

runNode(config)
  .then(app => {
    app.on('listening', () => {
      console.log(`🚀 Deth node listening on port: ${config.port}`)
    })
  })
  .catch(e => {
    console.error('Init error', e)
  })

function getConfigPathFromArgs (args: string[]): Path | undefined {
  const configPath = args[0]
  if (!configPath) {
    return undefined
  }

  return relativePathToPath(configPath, process.cwd())
}
