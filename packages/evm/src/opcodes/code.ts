import { ExecutionContext } from '../ExecutionContext'
import { GasCost } from './gasCosts'
import { Bytes32 } from '../Bytes32'

export function opCODESIZE (ctx: ExecutionContext) {
  ctx.useGas(GasCost.BASE)
  ctx.stack.push(Bytes32.fromNumber(ctx.message.code.length))
}

export function opCODECOPY (ctx: ExecutionContext) {
  const memoryOffset = ctx.stack.pop().toUnsignedNumber()
  const codeOffset = ctx.stack.pop().toUnsignedNumber()
  const memorySize = ctx.stack.pop().toUnsignedNumber()

  ctx.useGas(GasCost.VERYLOW + GasCost.COPY * Math.ceil(memorySize / 32))
  // we subtract the gas early in case of OutOfGas
  ctx.memory.useGasForAccess(memoryOffset, memorySize)

  const code = ctx.message.code
    .slice(codeOffset, codeOffset + memorySize)
    .padZeroesEnd(codeOffset + memorySize)
  ctx.memory.setBytes(memoryOffset, code)
}
