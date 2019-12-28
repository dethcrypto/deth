import express from 'express'
import bodyParser from 'body-parser'
import { asyncHandler } from '@restless/restless'

import { sanitizeRPC, executeRPC, respondRPC, sanitizeRPCEnvelope } from './rpc/middlewares'
import { errorHandler } from './errorHandler'
import { rpcCommandsDescription } from './rpc/description'
import { TestChain } from '../TestChain'
import { rpcExecutorFromCtx } from './rpc/rpcExecutor'

export interface NodeCtx {
  chain: TestChain,
}

export function runNode (port: number) {
  const ctx: NodeCtx = {
    chain: new TestChain(),
  }

  const rpcExecutor = rpcExecutorFromCtx(ctx)

  const app = express()

  app.use(bodyParser.json({ type: '*/*' }))

  app.post(
    '/',
    asyncHandler(
      sanitizeRPCEnvelope(),
      sanitizeRPC(rpcCommandsDescription),
      executeRPC(rpcExecutor),
      respondRPC(rpcCommandsDescription),
    ),
  )

  app.use(errorHandler)

  return app.listen(port)
}
