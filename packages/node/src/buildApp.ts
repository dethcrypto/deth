import { Services } from './services'
import { Config } from './config'
import express from 'express'
import bodyParser from 'body-parser'
import { asyncHandler } from '@restless/restless'
import { NotFoundHttpError, errorHandler } from './errorHandler'

// TODO: move rpc stuff elsewhere
import { sanitizeRPCEnvelope, sanitizeRPC, executeRPC, respondRPC } from './rpc/middlewares'
import { rpcCommandsDescription } from './rpc/schema'

export function buildApp (services: Services, config: Config) {
  const app = express()

  app.use(bodyParser.json({ type: '*/*' }))

  app.post(
    '/',
    asyncHandler(
      sanitizeRPCEnvelope(),
      sanitizeRPC(rpcCommandsDescription),
      executeRPC(services.rpcExecutor),
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
