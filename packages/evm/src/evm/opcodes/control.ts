import { ExecutionContext } from '../ExecutionContext'
import { GasCost } from './gasCosts'
import { InvalidJumpDestination } from '../errors'

export function opSTOP (ctx: ExecutionContext) {
  ctx.running = false
}

export function opJUMPDEST (ctx: ExecutionContext) {
  ctx.gasUsed += GasCost.JUMPDEST
}

export function opJUMP (ctx: ExecutionContext) {
  ctx.gasUsed += GasCost.MID
  const destination = ctx.stack.pop()
  const location = destination.toUnsignedNumber()
  if (ctx.code[location] === opJUMPDEST) {
    ctx.programCounter = location
  } else {
    throw new InvalidJumpDestination(destination)
  }
}

export function opJUMPI (ctx: ExecutionContext) {
  ctx.gasUsed += GasCost.HIGH
  // TODO: implement
}
