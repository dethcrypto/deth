import { InvalidOpcode, UnreachableInstruction } from '../errors'

export function invalidOpcode(opcode: number) {
  return function () {
    throw new InvalidOpcode(opcode)
  }
}

export function opUnreachable() {
  throw new UnreachableInstruction()
}
