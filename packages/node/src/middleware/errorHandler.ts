import { Context, Next } from 'koa'
import * as t from 'io-ts'
import { PathReporter } from 'io-ts/lib/PathReporter'
import { Left } from 'fp-ts/lib/Either'

export async function errorHandler (ctx: Context, next: Next) {
  try {
    await next()
  } catch (error) {
    let httpError: HttpError
    if (error instanceof IOTSError) {
      httpError = new BadRequestHttpError(error.details)
    } else if (error instanceof HttpError) {
      httpError = error
    } else {
      httpError = new InternalHttpError()
    }

    if (httpError instanceof InternalHttpError) {
      console.error('Internal error occured: ', error)
    }

    console.error(`<-- ERROR: ${httpError.code} - ${httpError.message} (${httpError.details})`)

    const isRPC = ctx.method === 'POST' && ctx.url === '/'
    if (isRPC) {
      ctx.status = httpError.code
      ctx.body = httpErrorToRpcErrorPayload(ctx, httpError)
    } else {
      ctx.status = httpError.code
      ctx.body = httpError.toBody()
    }
  }
}

export class IOTSError extends Error {
  readonly details: string[];

  constructor (details: Left<t.Errors>) {
    super('IO-TS error')

    this.details = PathReporter.report(details)
  }
}

export class HttpError extends Error {
  constructor (
    public readonly code: number,
    msg: string,
    public readonly details?: string[],
  ) {
    super(msg)
  }

  toBody (): object {
    return {
      error: {
        status: this.code,
        message: this.message,
        details: this.details,
      },
    }
  }
}

export class BadRequestHttpError extends HttpError {
  constructor (details: string[]) {
    super(400, 'BadRequest', details)
  }
}

export class NotFoundHttpError extends HttpError {
  constructor (public readonly details: string[] = []) {
    super(404, 'NotFound')
  }
}

export class InternalHttpError extends HttpError {
  constructor () {
    super(500, 'Internal')
  }
}

function httpErrorToRpcStatus (err: HttpError): number {
  switch (err.code) {
    case 400:
      return -32600
    case 404:
      return -32601
    default:
      return -32603
  }
}

function httpErrorToRpcErrorPayload (ctx: Context, err: HttpError): object {
  return {
    jsonrpc: '2.0',
    id: ctx.request.body.id ?? null,
    error: {
      code: httpErrorToRpcStatus(err),
      message: err.message,
      details: err.details,
    },
  }
}
