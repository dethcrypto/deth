import { Router } from 'express'
import bodyParser from 'body-parser'
import { asyncMiddleware } from './utils'

import { RPCExecutorType, rpcCommandsDescription } from '../rpc/schema'
import { sanitizeRPCEnvelope, sanitizeRPC, executeRPC, respondRPC } from '../rpc/middlewares'

export function rpcRouter (rpcExecutor: RPCExecutorType) {
  const router = Router()

  router.use(bodyParser.json({ type: '*/*' }))

  router.post('/', asyncMiddleware(async (req, res) => {
    const envelope = await sanitizeRPCEnvelope(req.body)
    const parameters = await sanitizeRPC(rpcCommandsDescription, envelope)
    const result = await executeRPC(rpcExecutor, envelope.method, parameters)
    const response = respondRPC(rpcCommandsDescription, envelope, result)
    res.status(200).send(response)
  }))

  return router
}
