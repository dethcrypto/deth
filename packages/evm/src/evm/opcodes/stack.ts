import { MachineWord } from '../MachineWord'
import { ExecutionContext } from '../ExecutionContext'
import { GasCost } from './gasCosts'

export function makeOpPUSH (bytes: string) {
  const word = MachineWord.fromHexString(bytes)
  const count = bytes.length / 2
  return function opPUSH (ctx: ExecutionContext) {
    ctx.useGas(GasCost.VERYLOW)
    ctx.programCounter += count
    ctx.stack.push(word)
  }
}

export function makeOpDUP (n: number) {
  return function opDUP (ctx: ExecutionContext) {
    ctx.useGas(GasCost.VERYLOW)
    ctx.stack.dup(n)
  }
}

export function makeOpSWAP (n: number) {
  return function opSWAP (ctx: ExecutionContext) {
    ctx.useGas(GasCost.VERYLOW)
    ctx.stack.swap(n)
  }
}

export function opPOP (ctx: ExecutionContext) {
  ctx.useGas(GasCost.BASE)
  ctx.stack.pop()
}
