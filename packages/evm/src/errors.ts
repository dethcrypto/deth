import { Bytes32 } from './Bytes32'
import { Byte } from './Byte'

export class VMError extends Error {
  constructor (message: string) {
    super('VM Exception: ' + message)
  }
}

export class StackUnderflow extends VMError {
  constructor () {
    super('Stack underflow')
  }
}

export class StackOverflow extends VMError {
  constructor () {
    super('Stack overflow')
  }
}

export class InvalidBytecode extends VMError {
  constructor () {
    super('Invalid bytecode')
  }
}

export class InvalidOpcode extends VMError {
  constructor (opcode: Byte) {
    super('Invalid opcode 0x' + opcode.toString(16).padStart(2, '0'))
  }
}

export class UnreachableInstruction extends VMError {
  constructor () {
    super('Unreachable instruction reached')
  }
}

export class InvalidJumpDestination extends VMError {
  constructor (destination: Bytes32) {
    super(`Invalid jump destination ${destination.toHex()}`)
  }
}

export class OutOfGas extends VMError {
  constructor () {
    super('Out of gas')
  }
}
