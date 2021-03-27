import { Bytes } from '../Bytes'
import { assertEncoding } from '../encoding'
import { rlpDecode, rlpEncode } from '../rlp'
import { hexPrefixDecode, hexPrefixEncode } from './hexPrefix'

export class TrieExtension {
  constructor(readonly path: string, readonly value: Bytes) {
    if (path.length === 0) {
      throw new TypeError('Expected nibble length >= 1')
    }
    if (value.length > 32) {
      throw new TypeError('Invalid node identifier')
    }
  }

  static decode(encoding: Bytes) {
    const decoded = rlpDecode(encoding)
    assertEncoding(Array.isArray(decoded) && decoded.length === 2)
    const [hp, value] = decoded
    assertEncoding(
      hp instanceof Bytes && value instanceof Bytes && value.length <= 32
    )
    const [remaining, flag] = hexPrefixDecode(hp)
    assertEncoding(flag === false && remaining.length >= 1)
    return new TrieExtension(remaining, value)
  }

  encode(): Bytes {
    return rlpEncode([hexPrefixEncode(this.path, false), this.value])
  }

  setPath(path: string) {
    return new TrieExtension(path, this.value)
  }

  setValue(value: Bytes) {
    return new TrieExtension(this.path, value)
  }
}
