import { ErrorRequestHandler } from 'express'
import * as t from 'io-ts'
import { PathReporter } from 'io-ts/lib/PathReporter'
import { Left } from 'fp-ts/lib/Either'

// @todo proper error handling
// classes for http errors
// respect JSON-RPC envelope
export const errorHandler: ErrorRequestHandler = function (err, req, res, next) {
  if (err instanceof IOTSError) {
    res.status(400)
    res.json({
      errors: err.errors,
    })
  } else {
    console.error(err)
    res.status(500)
    res.json({
      errors: [],
    })
  }
}

export class IOTSError extends Error {
  readonly errors: string[];

  constructor (errors: Left<t.Errors>) {
    super('IO-TS error')

    this.errors = PathReporter.report(errors)
  }
}
