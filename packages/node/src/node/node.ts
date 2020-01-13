import express from 'express'
import bodyParser from 'body-parser'
import { asyncHandler } from '@restless/restless'

import { sanitizeRPC, executeRPC, respondRPC, sanitizeRPCEnvelope } from './rpc/middlewares'
import { errorHandler, NotFoundHttpError } from './errorHandler'
import { rpcCommandsDescription } from './rpc/schema'
import { rpcExecutorFromCtx } from './rpc/rpcExecutor'
import { NodeCtx, makeDefaultCtx } from './ctx'

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

export async function runNode (port: number) {
  const app = getApp(await makeDefaultCtx())

  return app.listen(port)
}
