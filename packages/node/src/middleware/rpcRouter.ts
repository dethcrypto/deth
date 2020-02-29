import Router from 'koa-router'
import { RPCExecutorType, rpcCommandsDescription } from '../rpc/schema'
import { sanitizeRPCEnvelope, sanitizeRPC, executeRPC, respondRPC } from '../rpc/middlewares'

export function rpcRouter (rpcExecutor: RPCExecutorType) {
  const router = new Router()

  router.post('/', async ctx => {
    const envelope = await sanitizeRPCEnvelope(ctx.request.body)
    const parameters = await sanitizeRPC(rpcCommandsDescription, envelope)
    const result = await executeRPC(rpcExecutor, envelope.method, parameters)
    const response = respondRPC(rpcCommandsDescription, envelope, result)
    ctx.body = response
  })

  return router
}
