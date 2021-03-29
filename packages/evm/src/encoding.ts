export class InvalidEncoding extends Error {
  constructor() {
    super('Invalid encoding')
  }
}

export function assertEncoding(condition: boolean): asserts condition {
  if (!condition) {
    throw new InvalidEncoding()
  }
}
