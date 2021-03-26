import { Router } from 'express'
import bodyParser from 'body-parser'
import { asyncMiddleware } from './utils'

import { RPCExecutorType, rpcCommandsDescription } from '../rpc/schema'
import {
  parseRPCRequest,
  sanitizeRPC,
  executeRPC,
  respondRPC,
  JsonRpcResultEnvelope,
} from '../rpc/middlewares'

export function rpcRouter(rpcExecutor: RPCExecutorType) {
  const router = Router()

  router.use(bodyParser.json({ type: '*/*' }))

  router.post(
    '/',
    asyncMiddleware(async (req, res) => {
      const request = await parseRPCRequest(req.body)

      const responses: JsonRpcResultEnvelope[] = []
      for (const envelope of request.envelopes) {
        const parameters = await sanitizeRPC(rpcCommandsDescription, envelope)
        const result = await executeRPC(
          rpcExecutor,
          envelope.method,
          parameters
        )
        responses.push(respondRPC(rpcCommandsDescription, envelope, result))
      }

      res.status(200).send(request.batched ? responses : responses[0])
    })
  )

  return router
}
