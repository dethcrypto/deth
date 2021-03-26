#!/usr/bin/env node
import { runNode } from './runNode'
import { Path, relativePathToPath } from './services/fs/Path'
import { loadConfig, getConfigWithDefaults } from './config'
import { RealFileSystem } from './services/fs/RealFileSystem'

const config = getConfig(process.argv.slice(2))
runNode(config).catch(console.error)

function getConfig(args: string[]) {
  const configPath = getConfigPathFromArgs(args)
  return configPath
    ? loadConfig(new RealFileSystem(), configPath)
    : getConfigWithDefaults()
}

function getConfigPathFromArgs(args: string[]): Path | undefined {
  const configPath = args[0]
  if (!configPath) {
    return undefined
  }
  return relativePathToPath(configPath, process.cwd())
}
