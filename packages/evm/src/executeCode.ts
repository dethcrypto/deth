import { Byte } from './Byte'
import { ExecutionContext } from './ExecutionContext'
import { Memory } from './Memory'
import { Message } from './Message'
import { opSTOP } from './opcodes/control'
import { Stack } from './Stack'
import { State } from './State'
import { VMError } from './errors'

export interface ExecutionResult {
  stack: Stack,
  memory: Memory,
  state: State,
  gasUsed: number,
  gasRefund: number,
  programCounter: number,
  reverted: boolean,
  returnValue?: Byte[],
  error?: VMError,
}

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
    stack: ctx.stack,
    memory: ctx.memory.memory,
    state: (ctx.reverted || error) ? ctx.message.state : ctx.state,
    gasUsed: ctx.gasUsed,
    gasRefund: ctx.gasRefund,
    reverted: ctx.reverted,
    programCounter: ctx.programCounter,
    returnValue: ctx.returnValue,
    error,
  }
}
