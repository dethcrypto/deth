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
  constructor (opcode: string) {
    super('Invalid opcode 0x' + opcode)
  }
}

export class UnreachableInstruction extends VMError {
  constructor () {
    super('Unreachable instruction reached')
  }
}
