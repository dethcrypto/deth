import { ExecutionContext } from '../ExecutionContext'
import { GasCost } from './gasCosts'
import { Bytes32 } from '../Bytes32'
import { Bytes } from '../Bytes'

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

  // FIXME: slice does not work like this
  let code = ctx.message.code.slice(codeOffset, codeOffset + memorySize)
  while (code.length < memorySize) {
    code = code.concat(Bytes.fromNumber(0x00))
  }
  ctx.memory.setBytes(memoryOffset, code)
}
