import { MachineWord } from '../MachineWord'
import { ExecutionContext } from '../ExecutionContext'
import { GasCost } from './gasCosts'

export function opSSTORE (ctx: ExecutionContext) {
  const location = ctx.stack.pop()
  const value = ctx.stack.pop()

  const isZero = ctx.storage.get(location).equals(MachineWord.ZERO)
  ctx.useGas(isZero ? GasCost.SSET : GasCost.SRESET)

  ctx.storage.set(location, value)
}
