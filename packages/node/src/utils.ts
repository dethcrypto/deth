import { bufferToHex } from 'ethereumjs-util'
import { Address, makeAddress, HexString, makeHexString, Hash, makeHash } from './model'

export function bufferToAddress (buffer: Buffer): Address {
  return makeAddress(bufferToHex(buffer))
}

export function bufferToMaybeAddress (buffer?: Buffer): Address | undefined {
  return buffer && buffer.length > 0
    ? bufferToAddress(buffer)
    : undefined
}

export function bufferToHexString (buffer: Buffer): HexString {
  return makeHexString(bufferToHex(buffer))
}

export function bufferToHash (buffer: Buffer): Hash {
  return makeHash(bufferToHex(buffer))
}
