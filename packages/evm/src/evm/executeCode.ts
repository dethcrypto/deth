import { Opcode } from './opcodes'
import { ExecutionContext, ExecutionParameters } from './ExecutionContext'
import { Stack } from './Stack'
import { VMError } from './errors'
import { IMemory } from './Memory'
import { opSTOP } from './opcodes/control'
import { ReadonlyState } from './State'
import { Byte } from './Byte'

export interface ExecutionResult {
  stack: Stack,
  memory: IMemory,
  state: ReadonlyState,
  gasUsed: number,
  programCounter: number,
  reverted: boolean,
  returnValue?: Byte[],
  error?: VMError,
}

export function executeCode (code: Opcode[], params: ExecutionParameters): ExecutionResult {
  const ctx = new ExecutionContext(code, params)

  while (ctx.returnValue === undefined) {
    const opCode = code[ctx.programCounter] || opSTOP
    ctx.programCounter++
    try {
      opCode(ctx)
    } catch (e) {
      if (e instanceof VMError) {
        ctx.useRemainingGas()
        return toResult(ctx, params.state, e)
      } else {
        throw e
      }
    }
  }

  if (ctx.reverted) {
    // TODO: should there be a refund here?
    return toResult(ctx, params.state)
  }
  ctx.applyRefund()
  return toResult(ctx)
}

function toResult (
  ctx: ExecutionContext,
  state?: ReadonlyState,
  error?: VMError,
): ExecutionResult {
  return {
    stack: ctx.stack,
    // This prevents us from retaining a reference to ctx
    memory: ctx.memory.memory,
    state: state ?? ctx.state,
    gasUsed: ctx.getGasUsed(),
    reverted: ctx.reverted,
    programCounter: ctx.programCounter,
    returnValue: ctx.returnValue,
    error,
  }
}
