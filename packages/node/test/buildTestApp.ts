import { buildApp } from '../src/buildApp'
import { createServices, initServices, Services } from '../src/services'
import { mockFs } from './services/fs/fs.mock'
import { NoopLogger } from './services/Logger/NoopLogger'
import { getConfigWithDefaults, Config } from '../src/config/config'
import { Application } from 'express'

export interface TestApp extends Application {
  services: Services
  config: Config
}

export async function buildTestApp(): Promise<TestApp> {
  const config = getConfigWithDefaults()
  const services = createServices(config, {
    fileSystem: mockFs(),
    logger: new NoopLogger(),
  })

  await initServices(services, config)

  const app = buildApp(services, config)
  return Object.assign(app, { services, config })
}
