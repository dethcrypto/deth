import { Bytes32 } from '../Bytes32'
import { ExecutionContext } from '../ExecutionContext'

export function makeUnaryOp (
  gasCost: number,
  operation: (a: Bytes32) => Bytes32,
) {
  return (ctx: ExecutionContext) => {
    ctx.useGas(gasCost)
    ctx.stack.push(operation(
      ctx.stack.pop(),
    ))
  }
}

export function makeBinaryOp (
  gasCost: number,
  operation: (a: Bytes32, b: Bytes32) => Bytes32,
) {
  return (ctx: ExecutionContext) => {
    ctx.useGas(gasCost)
    ctx.stack.push(operation(
      ctx.stack.pop(),
      ctx.stack.pop(),
    ))
  }
}

export function makeTernaryOp (
  gasCost: number,
  operation: (a: Bytes32, b: Bytes32, c: Bytes32) => Bytes32,
) {
  return (ctx: ExecutionContext) => {
    ctx.useGas(gasCost)
    ctx.stack.push(operation(
      ctx.stack.pop(),
      ctx.stack.pop(),
      ctx.stack.pop(),
    ))
  }
}
