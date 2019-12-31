import { Opaque } from 'ts-essentials'
import { HEX_REGEX } from './common'
import { bufferToHex } from 'ethereumjs-util'

/**
 * @deprecated probably should be replaced with HexData
 * A hexadecimal string.
 * Always prefixed with 0x, always lowercase.
 */
export type HexString = Opaque<'HexString', string>
export function makeHexString (value: string): HexString {
  if (!HEX_REGEX.test(value)) {
    throw new TypeError(`Value "${value}" is not a valid hex string`)
  }
  return value.toLowerCase() as HexString
}

export function bufferToHexString (buffer: Buffer): HexString {
  return makeHexString(bufferToHex(buffer))
}
