import { MachineWord } from '../MachineWord'
import { ExecutionContext } from '../ExecutionContext'
import { GasCost, GasRefund } from './gasCosts'

export function opSSTORE (ctx: ExecutionContext) {
  const location = ctx.stack.pop()
  const value = ctx.stack.pop()

  const isZero = ctx.storage.get(location).equals(MachineWord.ZERO)
  ctx.useGas(isZero ? GasCost.SSET : GasCost.SRESET)
  if (!isZero && value.equals(MachineWord.ZERO)) {
    ctx.addRefund(GasRefund.SCLEAR)
  }

  ctx.storage.set(location, value)
}

export function opSLOAD (ctx: ExecutionContext) {
  ctx.useGas(GasCost.SLOAD)
  const location = ctx.stack.pop()
  const value = ctx.storage.get(location)
  ctx.stack.push(value)
}
