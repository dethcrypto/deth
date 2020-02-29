import { RequestHandler } from 'express'

export function asyncMiddleware (fn: RequestHandler): RequestHandler {
  return async (req, res, next) => {
    try {
      await fn(req, res, next)
    } catch (e) {
      next(e)
    }
  }
}
