import { assert, Dictionary } from 'ts-essentials'
import * as t from 'io-ts'
import { isRight, isLeft } from 'fp-ts/lib/Either'
import { responseOf } from '@restless/restless'
import { IOTSError } from '../errorHandler'
import { Request } from 'express'

type RPCSchema = Dictionary<{ parameters: t.Type<any>, returns: t.Type<any> }>;
type RPCExecutors = Dictionary<Function>;

const jsonRpcEnvelope = t.type({
  jsonrpc: t.literal('2.0'),
  id: t.number,
  method: t.string,
  params: t.any,
})

export function sanitizeRPCEnvelope () {
  return (_data: any, req: any) => {
    const result = jsonRpcEnvelope.decode(req.body)

    if (isLeft(result)) {
      throw new IOTSError(result)
    }
  }
}

export function sanitizeRPC<T extends t.Any> (
  schema: RPCSchema,
): (data: unknown, req: Request) => t.OutputOf<T> {
  return (_data, req) => {
    const m = req.body.method
    const rpcDescription = schema[m]
    if (!rpcDescription) {
      throw new Error(`RPC: ${m} not implemented`)
    }
    const params = req.body.params
    // we need to normalize empty arrays to undefineds
    const normalizedParams =
      Array.isArray(params) && params.length === 0 ? undefined : params

    const res = rpcDescription.parameters.decode(normalizedParams)

    if (isRight(res)) {
      return res.right
    }

    throw new IOTSError(res)
  }
}

export function executeRPC (executors: RPCExecutors) {
  return async (data: any, req: any) => {
    const method = req.body.method

    const executor = executors[method]
    assert(executor, `Couldn't find executor for ${method}`)

    return executor(data)
  }
}

export function respondRPC (schema: RPCSchema) {
  return (data: any, req: any) => {
    const method = req.body.method
    const rpcDescription = schema[method]
    assert(rpcDescription, `Couldn't find rpc description for ${method}`)

    const result = rpcDescription.returns.encode(data)

    return responseOf({
      jsonrpc: '2.0',
      id: req.body.id,
      result: result,
    })
  }
}
