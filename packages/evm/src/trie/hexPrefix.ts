import { Bytes } from '../Bytes'
import { assertEncoding } from '../encoding'

export function hexPrefixEncode(nibbles: string, flag: boolean): Bytes {
  if (!isNibbles(nibbles)) {
    throw new TypeError('Expected hex string')
  }
  const prefix =
    nibbles.length % 2 === 0 ? (flag ? '20' : '00') : flag ? '3' : '1'
  return Bytes.fromHex(prefix + nibbles)
}

export function hexPrefixDecode(bytes: Bytes): [string, boolean] {
  assertEncoding(bytes.length > 0)
  const hex = bytes.toHex()
  if (hex[0] === '0') {
    assertEncoding(hex[1] === '0')
    return [hex.substring(2), false]
  } else if (hex[0] === '2') {
    assertEncoding(hex[1] === '0')
    return [hex.substring(2), true]
  } else if (hex[0] === '1') {
    return [hex.substring(1), false]
  } else if (hex[0] === '3') {
    return [hex.substring(1), true]
  }
  assertEncoding(false)
}

const HEX_REGEX = /^[a-f\d]*$/
function isNibbles(value: unknown): value is string {
  return typeof value === 'string' && HEX_REGEX.test(value)
}
