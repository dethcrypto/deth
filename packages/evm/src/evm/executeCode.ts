import { Opcode } from './opcodes/Opcode'
import { ExecutionContext } from './ExecutionContext'
import { Stack } from './Stack'

export function executeCode (code: Opcode[]) {
  const ctx: ExecutionContext = {
    stack: new Stack(),
    running: true,
    gasUsed: 0,
    programCounter: 0,
  }

  while (ctx.programCounter < code.length && ctx.running) {
    const opCode = code[ctx.programCounter]
    ctx.programCounter++
    opCode(ctx)
  }

  return ctx
}
