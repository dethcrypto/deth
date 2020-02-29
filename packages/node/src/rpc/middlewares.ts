import { assert, Dictionary } from 'ts-essentials'
import { Mutex } from 'async-mutex'
import * as t from 'io-ts'
import { isRight, isLeft } from 'fp-ts/lib/Either'
import { IOTSError, NotFoundHttpError } from '../middleware/errorHandler'
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

type RpcEnvelope = t.TypeOf<typeof jsonRpcEnvelope>

export async function sanitizeRPCEnvelope (body: unknown) {
  const result = jsonRpcEnvelope.decode(body)
  if (isLeft(result)) {
    throw new IOTSError(result)
  }
  return result.right
}

export function sanitizeRPC<T extends t.Any> (
  schema: RPCSchema,
  { method, params }: RpcEnvelope,
): t.OutputOf<T> {
  const rpcDescription = schema[method]
  d(`--> RPC call ${method}`)
  d(`--> RPC call data ${JSON.stringify(params)}`)
  if (!rpcDescription) {
    throw new NotFoundHttpError([
      `RPC method: ${method} called with ${JSON.stringify(params)} not found`,
    ])
  }
  // we need to normalize empty arrays to undefineds
  const normalizedParams = Array.isArray(params) && params.length === 0 ? undefined : params

  const res = rpcDescription.parameters.decode(normalizedParams)

  if (isRight(res)) {
    return res.right
  }

  throw new IOTSError(res)
}

export function executeRPC (
  executors: RPCExecutors,
  method: string,
  params: unknown,
) {
  const executor = executors[method]
  assert(executor, `Couldn't find executor for ${method}`)

  // @todo: NOTE currently we run RPC calls sequentially. This limits performance but solves concurrency issues.
  return executionMutex.runExclusive(async () => {
    return executor(params)
  })
}

export function respondRPC (
  schema: RPCSchema,
  { method, id }: RpcEnvelope,
  result: unknown,
) {
  const rpcDescription = schema[method]
  d(`<-- RES: ${JSON.stringify(result)}`)
  assert(rpcDescription, `Couldn't find rpc description for ${method}`)

  return {
    jsonrpc: '2.0',
    id,
    result: rpcDescription.returns.encode(result),
  }
}
