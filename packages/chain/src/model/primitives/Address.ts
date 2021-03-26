import { Opaque } from 'ts-essentials'
import { HEX_REGEX } from './common'
import { bufferToHex, BN } from 'ethereumjs-util'

/**
 * An hexadecimal string representing an ethereum address.
 * Always prefixed with 0x, always lowercase and of length 42.
 */
export type Address = Opaque<'Address', string>
export function makeAddress(value: string): Address {
  if (!HEX_REGEX.test(value) || value.length !== 42) {
    throw new TypeError(`Value "${value}" is not a valid address`)
  }
  return value.toLowerCase() as Address
}

export function bufferToAddress(buffer: Buffer): Address {
  return makeAddress(bufferToHex(buffer))
}

export function bufferToMaybeAddress(buffer?: Buffer): Address | undefined {
  return buffer && buffer.length > 0 ? bufferToAddress(buffer) : undefined
}

export function bnToAddress(address: BN): Address {
  return makeAddress('0x' + address.toString('hex', 40))
}
