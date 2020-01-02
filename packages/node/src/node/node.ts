import express from 'express'
import bodyParser from 'body-parser'
import { asyncHandler } from '@restless/restless'

import {
  sanitizeRPC,
  executeRPC,
  respondRPC,
  sanitizeRPCEnvelope,
} from './rpc/middlewares'
import { errorHandler, NotFoundHttpError } from './errorHandler'
import { rpcCommandsDescription } from './rpc/description'
import { TestChain } from '../TestChain'
import { rpcExecutorFromCtx } from './rpc/rpcExecutor'

export interface NodeCtx {
  chain: TestChain,
}

export function getApp (ctx: NodeCtx) {
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

  app.use('/health', (req, res) => {
    res.status(200).json({
      status: 'OK',
    })
  })

  app.use('*', (_req, _res) => {
    throw new NotFoundHttpError()
  })

  app.use(errorHandler)

  return app
}

export function runNode (port: number) {
  const ctx: NodeCtx = {
    chain: new TestChain(),
  }

  const app = getApp(ctx)

  return app.listen(port)
}
