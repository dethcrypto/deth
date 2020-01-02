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
