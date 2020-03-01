import express from 'express'
import path from 'path'

import { Services } from './services'
import { Config } from './config'

import { errorHandler } from './middleware/errorHandler'
import { notFound } from './middleware/notFound'
import { rpcRouter } from './middleware/rpcRouter'
import { healthRouter } from './middleware/healthRouter'
import { explorerRouter } from './middleware/explorerRouter'

export function buildApp (services: Services, config: Config) {
  const app = express()

  app.set('views', path.join(__dirname, './views'))
  app.use('/static', express.static(path.join(__dirname, './static')))

  app.use(rpcRouter(services.rpcExecutor))
  app.use(healthRouter())
  app.use(explorerRouter(services.explorer))

  app.use(notFound)
  app.use(errorHandler)

  return app
}
