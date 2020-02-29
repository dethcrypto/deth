import { Config } from './config'
import { createServices, initServices } from './services'
import { buildApp } from './buildApp'

export async function runNode (config: Config) {
  const services = createServices(config)
  await initServices(services, config)

  const app = buildApp(services, config)

  return app.listen(config.port)
}
