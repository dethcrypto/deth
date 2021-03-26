import { Opaque } from 'ts-essentials'
import { HEX_REGEX } from './common'
import { bufferToHex, toBuffer } from 'ethereumjs-util'

/**
 * A hexadecimal string representing a hash.
 * Always prefixed with 0x, always lowercase and of length 66.
 */
export type Hash = Opaque<'Hash', string>
export function makeHash(value: string): Hash {
  if (!HEX_REGEX.test(value) || value.length !== 66) {
    throw new TypeError(`Value "${value}" is not a valid hash`)
  }
  return value.toLowerCase() as Hash
}

export function bufferToHash(buffer: Buffer): Hash {
  return makeHash(bufferToHex(buffer))
}

export function hashToBuffer(hash: Hash): Buffer {
  return toBuffer(hash)
}
