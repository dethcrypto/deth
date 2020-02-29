import Koa from 'koa'
import koaBody from 'koa-body'

import { Services } from './services'
import { Config } from './config'

import { errorHandler } from './middleware/errorHandler'
import { rpcRouter } from './middleware/rpcRouter'
import { healthRouter } from './middleware/healthRouter'
import { notFoundRouter } from './middleware/notFoundRouter'

export function buildApp (services: Services, config: Config) {
  const app = new Koa()

  app.use(koaBody())

  app.use(errorHandler)
  app.use(rpcRouter(services.rpcExecutor).routes())
  app.use(healthRouter().routes())
  app.use(notFoundRouter().routes())

  return app
}
