import { Bytes } from '../Bytes'
import { assertEncoding } from '../encoding'
import { rlpDecode, rlpEncode } from '../rlp'
import { hexPrefixDecode, hexPrefixEncode } from './hexPrefix'

export class TrieLeaf {
  constructor(readonly remaining: string, readonly value: Bytes) {}

  static decode(encoding: Bytes) {
    const decoded = rlpDecode(encoding)
    assertEncoding(Array.isArray(decoded) && decoded.length === 2)
    const [path, value] = decoded
    assertEncoding(path instanceof Bytes && value instanceof Bytes)
    const [remaining, flag] = hexPrefixDecode(path)
    assertEncoding(flag === true)
    return new TrieLeaf(remaining, value)
  }

  encode(): Bytes {
    return rlpEncode([hexPrefixEncode(this.remaining, true), this.value])
  }
}
