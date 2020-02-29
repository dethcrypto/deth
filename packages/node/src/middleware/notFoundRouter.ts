import Router from 'koa-router'
import { NotFoundHttpError } from './errorHandler'

export function notFoundRouter () {
  const router = new Router()

  router.get('*', async () => {
    throw new NotFoundHttpError()
  })

  return router
}
