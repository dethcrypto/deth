import React from 'react'
import { Router } from 'express'
import { asyncMiddleware } from './utils'
import { Explorer } from '../services/Explorer'
import { renderPage } from '../views/render'
import { Home } from '../views/Home'
import { ComingSoon } from '../views/ComingSoon'
import { NotFound } from '../views/NotFound'

export function explorerRouter (explorer: Explorer) {
  const router = Router()

  router.get('/explorer', asyncMiddleware(async (req, res) => {
    const blocks = await explorer.getLatestBlocks(10)
    const transactions = await explorer.getLatestTransactions(10)
    res.send(renderPage(
      'Explorer',
      <Home blocks={blocks} transactions={transactions} />,
    ))
  }))

  router.get('/explorer/blocks', asyncMiddleware(async (req, res) => {
    res.send(renderPage(
      'Blocks',
      <ComingSoon />
    ))
  }))

  router.get('/explorer/blocks/:hash', asyncMiddleware(async (req, res) => {
    res.send(renderPage(
      `Block ${req.params.hash}`,
      <ComingSoon />
    ))
  }))

  router.get('/explorer/transactions', asyncMiddleware(async (req, res) => {
    res.send(renderPage(
      'Transactions',
      <ComingSoon />
    ))
  }))

  router.get('/explorer/transactions/:hash', asyncMiddleware(async (req, res) => {
    res.send(renderPage(
      `Transaction ${req.params.hash}`,
      <ComingSoon />
    ))
  }))

  router.get('/explorer/address/:address', asyncMiddleware(async (req, res) => {
    res.send(renderPage(
      `Address ${req.params.address}`,
      <ComingSoon />
    ))
  }))

  router.get('/explorer/search', asyncMiddleware(async (req, res) => {
    res.send(renderPage(
      'Search',
      <ComingSoon />
    ))
  }))

  router.get('*', asyncMiddleware(async (req, res) => {
    res.status(404).send(renderPage(
      'Not found',
      <NotFound />
    ))
  }))

  return router
}
