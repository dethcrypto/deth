import { Bytes } from '../Bytes'
import { assertEncoding } from '../encoding'
import { rlpDecode, rlpEncode } from '../rlp'
import { hexPrefixDecode, hexPrefixEncode } from './hexPrefix'

export class TrieLeaf {
  constructor(readonly path: string, readonly value: Bytes) {}

  static decode(encoding: Bytes) {
    const decoded = rlpDecode(encoding)
    assertEncoding(Array.isArray(decoded) && decoded.length === 2)
    const [hp, value] = decoded
    assertEncoding(hp instanceof Bytes && value instanceof Bytes)
    const [path, flag] = hexPrefixDecode(hp)
    assertEncoding(flag === true)
    return new TrieLeaf(path, value)
  }

  encode(): Bytes {
    return rlpEncode([hexPrefixEncode(this.path, true), this.value])
  }
}
