import { Router } from 'express'

export function healthRouter () {
  const router = Router()

  router.get('/health', (req, res) => {
    res.status(200).send({ status: 'OK' })
  })

  return router
}
