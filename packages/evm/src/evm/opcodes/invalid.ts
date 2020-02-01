import { ExecutionContext } from '../ExecutionContext'
import { InvalidOpcode, UnreachableInstruction } from '../errors'
import { Byte } from '../Byte'

export function invalidOpcode (opcode: Byte) {
  return function (ctx: ExecutionContext) {
    throw new InvalidOpcode(opcode)
  }
}

export function opUnreachable (ctx: ExecutionContext) {
  throw new UnreachableInstruction()
}
