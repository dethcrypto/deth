import { Bytes } from '../Bytes'

export function hexPrefixEncode(nibbles: number[], flag: boolean): Bytes {
  const hex = toHex(nibbles)
  const prefix = hex.length % 2 === 0 ? (flag ? '20' : '00') : flag ? '3' : '1'
  return Bytes.fromHex(prefix + hex)
}

export function hexPrefixDecode(bytes: Bytes): [number[], boolean] {
  check(bytes.length > 0)
  const hex = bytes.toHex()
  if (hex[0] === '0') {
    check(hex[1] === '0')
    return [toNibbles(hex.substring(2)), false]
  } else if (hex[0] === '2') {
    check(hex[1] === '0')
    return [toNibbles(hex.substring(2)), true]
  } else if (hex[0] === '1') {
    return [toNibbles(hex.substring(1)), false]
  } else if (hex[0] === '3') {
    return [toNibbles(hex.substring(1)), true]
  }
  check(false)
}

function toHex(nibbles: number[]) {
  return nibbles.map((x) => x.toString(16)).join('')
}

function toNibbles(hex: string) {
  return hex.split('').map((x) => parseInt(x, 16))
}

function check(value: boolean): asserts value {
  if (!value) {
    throw new TypeError('Invalid encoding')
  }
}
