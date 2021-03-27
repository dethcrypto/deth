import { Bytes } from '../Bytes'
import { assertEncoding } from '../encoding'
import { rlpDecode, rlpEncode } from '../rlp'

export class TrieBranch {
  constructor(readonly children: Bytes[], readonly value: Bytes) {
    if (children.length !== 16) {
      throw new TypeError('Expected exactly 16 children')
    }
    if (!children.every((x) => x.length <= 32)) {
      throw new TypeError('Invalid node identifier')
    }
    const nonEmpty = children.reduce(
      (n, c) => n + (c.length === 0 ? 0 : 1),
      value.length === 0 ? 0 : 1
    )
    if (nonEmpty < 2) {
      throw new TypeError('Expected at least 2 non-empty')
    }
  }

  static decode(encoding: Bytes) {
    const decoded = rlpDecode(encoding)
    assertEncoding(
      Array.isArray(decoded) &&
        decoded.length === 17 &&
        decoded.every((x) => x instanceof Bytes) &&
        decoded.reduce((n, c) => n + (c.length === 0 ? 0 : 1), 0) >= 2
    )
    const children = decoded.slice(0, 16) as Bytes[]
    assertEncoding(children.every((x) => x.length <= 32))
    const value = decoded[16] as Bytes
    return new TrieBranch(children, value)
  }

  encode(): Bytes {
    return rlpEncode([...this.children, this.value])
  }
}
