import express from 'express'
import bodyParser from 'body-parser'
import { asyncHandler } from '@restless/restless'

import { sanitizeRPC, executeRPC, respondRPC, sanitizeRPCEnvelope } from './rpc/middlewares'
import { errorHandler, NotFoundHttpError } from './errorHandler'
import { rpcCommandsDescription } from './rpc/schema'
import { rpcExecutorFromCtx } from './rpc/rpcExecutor'
import { NodeCtx, makeDefaultCtx } from './ctx'
import { Path } from '../fs/Path'
import { loadConfig } from '../config/loader'
import { RealFileSystem } from '../fs/RealFileSystem'

export function getApp(ctx: NodeCtx) {
  const rpcExecutor = rpcExecutorFromCtx(ctx)

  const app = express()

  app.use(bodyParser.json({ type: '*/*' }))

  app.post(
    '/',
    asyncHandler(
      sanitizeRPCEnvelope(),
      sanitizeRPC(rpcCommandsDescription),
      executeRPC(rpcExecutor),
      respondRPC(rpcCommandsDescription)
    )
  )

  app.use('/health', (req, res) => {
    res.status(200).json({
      status: 'OK'
    })
  })

  app.use('*', (_req, _res) => {
    throw new NotFoundHttpError()
  })

  app.use(errorHandler)

  return app
}

export async function runNode(port: number, configPath: Path | undefined) {
  const fs = new RealFileSystem()
  if (configPath) {
    console.log(`Using ${configPath}`)
  }

  const app = getApp(await makeDefaultCtx(configPath && loadConfig(fs, configPath)))

  return app.listen(port)
}
