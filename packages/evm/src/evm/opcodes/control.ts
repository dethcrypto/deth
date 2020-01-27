import { ExecutionContext } from '../ExecutionContext'
import { GasCost } from './gasCosts'
import { InvalidJumpDestination } from '../errors'
import { Bytes32 } from '../Bytes32'

export function opSTOP (ctx: ExecutionContext) {
  ctx.useGas(GasCost.ZERO)
  ctx.returnValue = []
}

export function opRETURN (ctx: ExecutionContext) {
  ctx.useGas(GasCost.ZERO)
  ctx.returnValue = ctx.memory.getBytes(
    ctx.stack.pop().toUnsignedNumber(),
    ctx.stack.pop().toUnsignedNumber(),
  )
}

export function opREVERT (ctx: ExecutionContext) {
  ctx.useGas(GasCost.ZERO)
  ctx.returnValue = ctx.memory.getBytes(
    ctx.stack.pop().toUnsignedNumber(),
    ctx.stack.pop().toUnsignedNumber(),
  )
  ctx.reverted = true
}

export function opJUMPDEST (ctx: ExecutionContext) {
  ctx.useGas(GasCost.JUMPDEST)
}

export function opJUMP (ctx: ExecutionContext) {
  ctx.useGas(GasCost.MID)

  const destination = ctx.stack.pop()
  const location = destination.toUnsignedNumber()

  if (ctx.code[location] === opJUMPDEST) {
    ctx.programCounter = location
  } else {
    throw new InvalidJumpDestination(destination)
  }
}

export function opJUMPI (ctx: ExecutionContext) {
  ctx.useGas(GasCost.HIGH)

  const destination = ctx.stack.pop()
  const location = destination.toUnsignedNumber()
  const condition = ctx.stack.pop()

  if (!condition.equals(Bytes32.ZERO)) {
    if (ctx.code[location] === opJUMPDEST) {
      ctx.programCounter = location
    } else {
      throw new InvalidJumpDestination(destination)
    }
  }
}
