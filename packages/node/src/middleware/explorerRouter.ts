import { Router } from 'express'
import { asyncMiddleware } from './utils'

export function explorerRouter () {
  const router = Router()

  router.get('/explorer', asyncMiddleware(async (req, res) => {
    res.render('home.ejs', { name: 'Explorer' })
  }))

  return router
}
