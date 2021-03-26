import { Bytes32 } from '../Bytes32'
import { ExecutionContext } from '../ExecutionContext'
import { GasCost } from './gasCosts'
import { Bytes } from '../Bytes'

export function makeOpPUSH(bytes: Bytes) {
  const word = Bytes32.fromBytes(bytes)
  return function opPUSH(ctx: ExecutionContext) {
    ctx.useGas(GasCost.VERYLOW)
    ctx.programCounter += bytes.length
    ctx.stack.push(word)
  }
}

export function makeOpDUP(n: number) {
  return function opDUP(ctx: ExecutionContext) {
    ctx.useGas(GasCost.VERYLOW)
    ctx.stack.dup(n)
  }
}

export function makeOpSWAP(n: number) {
  return function opSWAP(ctx: ExecutionContext) {
    ctx.useGas(GasCost.VERYLOW)
    ctx.stack.swap(n)
  }
}

export function opPOP(ctx: ExecutionContext) {
  ctx.useGas(GasCost.BASE)
  ctx.stack.pop()
}
