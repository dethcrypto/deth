import { Opcode } from './opcodes'
import { ExecutionContext } from './ExecutionContext'
import { Stack } from './Stack'
import { VMError } from './errors'

export interface ExecutionResult {
  stack: Stack,
  gasUsed: number,
  programCounter: number,
  error?: VMError,
}

export function executeCode (code: Opcode[], gasLimit: number): ExecutionResult {
  const ctx = new ExecutionContext(code, gasLimit)

  while (ctx.programCounter < code.length && ctx.running) {
    const opCode = code[ctx.programCounter]
    ctx.programCounter++
    try {
      opCode(ctx)
    } catch (e) {
      if (e instanceof VMError) {
        ctx.useRemainingGas()
        return toResult(ctx, e)
      } else {
        throw e
      }
    }
  }

  return toResult(ctx)
}

function toResult (ctx: ExecutionContext, error?: VMError): ExecutionResult {
  return {
    stack: ctx.stack,
    gasUsed: ctx.getGasUsed(),
    programCounter: ctx.programCounter,
    error,
  }
}
