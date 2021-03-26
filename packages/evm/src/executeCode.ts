import { ExecutionContext } from './ExecutionContext'
import { Message } from './Message'
import { opSTOP } from './opcodes/control'
import { VMError } from './errors'
import { ExecutionResult } from './ExecutionResult'
import { State } from './State'

export function executeCode(message: Message, state: State): ExecutionResult {
  const ctx = new ExecutionContext(message, state)

  while (ctx.returnValue === undefined) {
    const opcode = ctx.code[ctx.programCounter] || opSTOP
    ctx.programCounter++
    try {
      opcode(ctx)
    } catch (error) {
      if (error instanceof VMError) {
        return {
          type: 'ExecutionError',
          error,
        }
      } else {
        // programmer error
        throw error
      }
    }
  }

  if (ctx.reverted) {
    return {
      type: 'ExecutionRevert',
      gasUsed: ctx.gasUsed,
      returnValue: ctx.returnValue,
    }
  } else {
    return {
      type: 'ExecutionSuccess',
      gasUsed: ctx.gasUsed,
      gasRefund: ctx.gasRefund,
      returnValue: ctx.returnValue,
      state: ctx.state,
    }
  }
}
