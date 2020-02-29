import { buildApp } from '../src/buildApp'
import { createServices, initServices, Services } from '../src/services'
import { mockFs } from './services/fs/fs.mock'
import { NoopLogger } from './services/Logger/NoopLogger'
import { getConfigWithDefaults, Config } from '../src/config/config'
import Koa from 'koa'

export interface TestApp extends Koa {
  services: Services,
  config: Config,
}

export async function buildTestApp () {
  const config = getConfigWithDefaults()
  const services = createServices(config, {
    fileSystem: mockFs(),
    logger: new NoopLogger(),
  })

  await initServices(services, config)

  const app = buildApp(services, config) as unknown as TestApp
  app.services = services
  app.config = config

  return app
}
