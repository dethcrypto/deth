import { Router } from 'express'
import { NotFoundHttpError } from './errorHandler'

export function notFoundRouter () {
  const router = Router()

  router.get('*', () => {
    throw new NotFoundHttpError()
  })

  return router
}
