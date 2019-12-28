import { runNode } from './node'

const PORT = 8545

const app = runNode(PORT)

app.on('listening', () => {
  console.log(`🚀 Deth node launched on port: ${PORT}`)
})
