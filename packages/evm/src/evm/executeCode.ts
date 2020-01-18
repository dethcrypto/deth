import { Opcode } from './opcodes'
import { ExecutionContext } from './ExecutionContext'
import { Stack } from './Stack'
import { VMError } from './errors'
import { IMemory } from './Memory'
import { opSTOP } from './opcodes/control'

export interface ExecutionResult {
  stack: Stack,
  memory: IMemory,
  gasUsed: number,
  programCounter: number,
  reverted: boolean,
  returnValue?: number[],
  error?: VMError,
}

export function executeCode (code: Opcode[], gasLimit: number): ExecutionResult {
  const ctx = new ExecutionContext(code, gasLimit)

  while (ctx.returnValue === undefined) {
    const opCode = code[ctx.programCounter] || opSTOP
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
    // This prevents us from retaining a reference to ctx
    memory: ctx.memory.memory,
    gasUsed: ctx.getGasUsed(),
    reverted: ctx.reverted,
    programCounter: ctx.programCounter,
    returnValue: ctx.returnValue,
    error,
  }
}
