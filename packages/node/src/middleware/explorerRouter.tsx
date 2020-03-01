import React from 'react'
import { Router } from 'express'
import { asyncMiddleware } from './utils'
import { Explorer } from '../services/Explorer'
import { renderPage } from '../views/render'
import { Home } from '../views/Home'

export function explorerRouter (explorer: Explorer) {
  const router = Router()

  router.get('/explorer', asyncMiddleware(async (req, res) => {
    const blocks = await explorer.getLatestBlocks(10)
    const page = renderPage('Explorer', <Home blocks={blocks} />)
    res.send(page)
  }))

  return router
}
