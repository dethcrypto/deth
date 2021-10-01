#!/usr/bin/env node
import { runNode } from './runNode'
import { Path, relativePathToPath } from './services/fs/Path'
import { loadConfig, getConfigWithDefaults } from './config'
import { RealFileSystem } from './services/fs/RealFileSystem'

const args = parseArgs()

if (args.help) {
  printHelp()
} else {
  const config = getConfig(args.configPath)
  runNode(config).catch(console.error)
}

function getConfig(configPath: Path | undefined) {
  return configPath
    ? loadConfig(new RealFileSystem(), configPath)
    : getConfigWithDefaults()
}

function parseArgs() {
  const args = process.argv.slice(2)

  if (['help', '--help', '-h'].includes(args[0])) {
    return { help: true }
  }

  const configPath = args[0]

  return {
    configPath: configPath
      ? relativePathToPath(configPath, process.cwd())
      : undefined,
  }
}

function printHelp() {
  console.log(`\
Usage:
  deth [config-path]`)
}
