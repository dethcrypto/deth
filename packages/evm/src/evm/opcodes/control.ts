import { ExecutionContext } from '../ExecutionContext'

export function opSTOP (ctx: ExecutionContext) {
  ctx.running = false
}
