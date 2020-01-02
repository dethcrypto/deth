import { MachineWord } from '../../MachineWord'
import { ExecutionContext } from '../ExecutionContext'

export function makeUnaryOp (
  gasCost: number,
  operation: (a: MachineWord) => MachineWord
) {
  return (ctx: ExecutionContext) => {
    ctx.gasUsed += gasCost
    ctx.stack.push(operation(
      ctx.stack.pop(),
    ))
  }
}

export function makeBinaryOp (
  gasCost: number,
  operation: (a: MachineWord, b: MachineWord) => MachineWord
) {
  return (ctx: ExecutionContext) => {
    ctx.gasUsed += gasCost
    ctx.stack.push(operation(
      ctx.stack.pop(),
      ctx.stack.pop(),
    ))
  }
}

export function makeTernaryOp (
  gasCost: number,
  operation: (a: MachineWord, b: MachineWord, c: MachineWord) => MachineWord
) {
  return (ctx: ExecutionContext) => {
    ctx.gasUsed += gasCost
    ctx.stack.push(operation(
      ctx.stack.pop(),
      ctx.stack.pop(),
      ctx.stack.pop(),
    ))
  }
}
