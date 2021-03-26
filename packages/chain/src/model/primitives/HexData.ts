import { Opaque } from 'ts-essentials'
import { HEX_REGEX } from './common'
import { bufferToHex } from 'ethereumjs-util'

/**
 * A hexadecimal string representing bytes of data.
 * Always prefixed with 0x, always lowercase.
 */
export type HexData = Opaque<'HexData', string>
export function makeHexData(value: string): HexData {
  if (!HEX_REGEX.test(value) || value.length % 2 !== 0) {
    throw new TypeError(`Value "${value}" is not valid hex data`)
  }
  return value.toLowerCase() as HexData
}

export function bufferToHexData(buffer: Buffer): HexData {
  return makeHexData(bufferToHex(buffer))
}
