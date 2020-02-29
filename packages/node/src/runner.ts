#!/usr/bin/env node
import { runNode } from './node'
import { Path, relativePathToPath } from './fs/Path'

const PORT = 8545
const args = process.argv.slice(2)

const configPath = getConfigPathFromArgs(args)

runNode(PORT, configPath)
  .then(app => {
    app.on('listening', () => {
      console.log(`🚀 Deth node listening on port: ${PORT}`)
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
