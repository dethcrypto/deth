import { runNode } from './node'

const PORT = 8545

runNode(PORT)
  .then(app => {
    app.on('listening', () => {
      console.log(`🚀 Deth node launched on port: ${PORT}`)
    })
  })
  .catch(e => {
    console.error('Init error', e)
  })
