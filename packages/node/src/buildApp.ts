import express from 'express'

import { Services } from './services'
import { Config } from './config'

import { errorHandler } from './middleware/errorHandler'
import { rpcRouter } from './middleware/rpcRouter'
import { healthRouter } from './middleware/healthRouter'
import { notFoundRouter } from './middleware/notFoundRouter'

export function buildApp (services: Services, config: Config) {
  const app = express()

  app.use(rpcRouter(services.rpcExecutor))
  app.use(healthRouter())
  app.use(notFoundRouter())

  app.use(errorHandler)

  return app
}
