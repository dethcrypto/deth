import { ExecutionContext } from './ExecutionContext'
import { Message } from './Message'
import { opSTOP } from './opcodes/control'
import { VMError } from './errors'
import { ExecutionResult } from './ExecutionResult'

export function executeCode (message: Message): ExecutionResult {
  const ctx = new ExecutionContext(message)
  while (ctx.returnValue === undefined) {
    const opcode = ctx.code[ctx.programCounter] || opSTOP
    ctx.programCounter++
    try {
      opcode(ctx)
    } catch (e) {
      if (e instanceof VMError) {
        ctx.useRemainingGas()
        return toResult(ctx, e)
      } else {
        throw e // this should never happen
      }
    }
  }
  return toResult(ctx)
}

function toResult (ctx: ExecutionContext, error?: VMError): ExecutionResult {
  return {
    state: (ctx.reverted || error) ? ctx.message.state : ctx.state,
    gasUsed: ctx.gasUsed,
    gasRefund: ctx.gasRefund,
    reverted: ctx.reverted,
    returnValue: ctx.returnValue,
    error,
  }
}
