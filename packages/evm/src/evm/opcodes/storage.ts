import { Bytes32 } from '../Bytes32'
import { ExecutionContext } from '../ExecutionContext'
import { GasCost, GasRefund } from './gasCosts'

export function opSSTORE (ctx: ExecutionContext) {
  const location = ctx.stack.pop()
  const value = ctx.stack.pop()

  const stored = ctx.state.getStorage(ctx.message.account, location)
  const isZero = stored.equals(Bytes32.ZERO)
  ctx.useGas(isZero ? GasCost.SSET : GasCost.SRESET)
  if (!isZero && value.equals(Bytes32.ZERO)) {
    ctx.refund(GasRefund.SCLEAR)
  }

  ctx.state.setStorage(ctx.message.account, location, value)
}

export function opSLOAD (ctx: ExecutionContext) {
  ctx.useGas(GasCost.SLOAD)
  const location = ctx.stack.pop()
  const value = ctx.state.getStorage(ctx.message.account, location)
  ctx.stack.push(value)
}
