import { Bytes32 } from '../Bytes32'
import { ExecutionContext } from '../ExecutionContext'
import { GasCost, GasRefund } from './gasCosts'

export function opSSTORE (ctx: ExecutionContext) {
  const location = ctx.stack.pop()
  const value = ctx.stack.pop()

  const isZero = ctx.state.getStorage(ctx.address, location).equals(Bytes32.ZERO)
  ctx.useGas(isZero ? GasCost.SSET : GasCost.SRESET)
  if (!isZero && value.equals(Bytes32.ZERO)) {
    ctx.addRefund(GasRefund.SCLEAR)
  }

  ctx.state.setStorage(ctx.address, location, value)
}

export function opSLOAD (ctx: ExecutionContext) {
  ctx.useGas(GasCost.SLOAD)
  const location = ctx.stack.pop()
  const value = ctx.state.getStorage(ctx.address, location)
  ctx.stack.push(value)
}
