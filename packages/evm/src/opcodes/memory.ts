import { Bytes32 } from '../Bytes32'
import { ExecutionContext } from '../ExecutionContext'
import { GasCost } from './gasCosts'

export function opMSIZE (ctx: ExecutionContext) {
  ctx.useGas(GasCost.BASE)
  const size = ctx.memory.getSize()
  const result = Bytes32.fromNumber(size)
  ctx.stack.push(result)
}

export function opMLOAD (ctx: ExecutionContext) {
  ctx.useGas(GasCost.VERYLOW)
  const offset = ctx.stack.pop().toUnsignedNumber()
  const bytes = ctx.memory.getBytes(offset, 32)
  const result = Bytes32.fromBytes(bytes)
  ctx.stack.push(result)
}

export function opMSTORE (ctx: ExecutionContext) {
  ctx.useGas(GasCost.VERYLOW)
  const offset = ctx.stack.pop().toUnsignedNumber()
  const bytes = ctx.stack.pop().toBytes()
  ctx.memory.setBytes(offset, bytes)
}

export function opMSTORE8 (ctx: ExecutionContext) {
  ctx.useGas(GasCost.VERYLOW)
  const offset = ctx.stack.pop().toUnsignedNumber()
  const bytes = ctx.stack.pop().toBytes()
  ctx.memory.setBytes(offset, bytes.slice(31, 32))
}
