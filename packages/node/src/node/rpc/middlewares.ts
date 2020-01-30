import { assert, Dictionary } from 'ts-essentials'
import { Mutex } from 'async-mutex'
import * as t from 'io-ts'
import { isRight, isLeft } from 'fp-ts/lib/Either'
import { responseOf } from '@restless/restless'
import { IOTSError, NotFoundHttpError } from '../errorHandler'
import { Request } from 'express'
import debug from 'debug'

const d = debug('deth:rpc')

type RPCSchema = Dictionary<{ parameters: t.Type<any>, returns: t.Type<any> }>
type RPCExecutors = Dictionary<Function>

const executionMutex = new Mutex()

const jsonRpcEnvelope = t.type({
  jsonrpc: t.literal('2.0'),
  id: t.union([t.number, t.string]),
  method: t.string,
  params: t.any,
})

export function sanitizeRPCEnvelope () {
  return (_data: any, req: Request) => {
    const result = jsonRpcEnvelope.decode(req.body)

    if (isLeft(result)) {
      throw new IOTSError(result)
    }
  }
}

export function sanitizeRPC<T extends t.Any> (schema: RPCSchema): (data: unknown, req: Request) => t.OutputOf<T> {
  return (_data, req) => {
    const m = req.body.method
    const rpcDescription = schema[m]
    d(`--> RPC call ${m}`)
    d(`--> RPC call data ${JSON.stringify(req.body.params)}`)
    if (!rpcDescription) {
      throw new NotFoundHttpError()
    }
    const params = req.body.params
    // we need to normalize empty arrays to undefineds
    const normalizedParams = Array.isArray(params) && params.length === 0 ? undefined : params

    const res = rpcDescription.parameters.decode(normalizedParams)

    if (isRight(res)) {
      return res.right
    }

    throw new IOTSError(res)
  }
}

export function executeRPC (executors: RPCExecutors) {
  return async (data: unknown, req: Request) => {
    const method = req.body.method

    const executor = executors[method]
    assert(executor, `Couldn't find executor for ${method}`)

    // @todo: NOTE currently we run RPC calls sequentially. This limits performance but solves concurrency issues.
    return executionMutex.runExclusive(async () => {
      return executor(data)
    })
  }
}

export function respondRPC (schema: RPCSchema) {
  return (data: unknown, req: Request) => {
    const method = req.body.method
    const rpcDescription = schema[method]
    d(`<-- RES: ${JSON.stringify(data)}`)
    assert(rpcDescription, `Couldn't find rpc description for ${method}`)

    const result = rpcDescription.returns.encode(data)

    return responseOf({
      jsonrpc: '2.0',
      id: req.body.id,
      result: result,
    })
  }
}
