import { Opaque } from 'ts-essentials'

const HEX_REGEX = /^0x[\da-fA-F]*$/

/**
 * Ethereum hard fork name
 */
export type Hardfork = 'byzantium' | 'constantinople' | 'petersburg' | 'istanbul'

/**
 * Identifies the desired block.
 * Represented as a hex string without leading zeroes, e.g. `'0x1F3'`.
 * The smallest value is `'0x0'`.
 * Can also have one of the special values: `'latest'` or `'pending'`.
 */
export type BlockTag = Opaque<'BlockTag', string>
export function makeBlockTag (value: string): BlockTag {
  if (
    HEX_REGEX.test(value) ||
    value === 'earliest' ||
    value === 'latest' ||
    value === 'pending'
  ) {
    return value.toLowerCase() as BlockTag
  }
  throw new TypeError(`Value "${value}" is not a valid block tag`)
}

/**
 * A hexadecimal string representing a hash.
 * Always prefixed with 0x, always lowercase and of length 66.
 */
export type Hash = Opaque<'Hash', string>
export function makeHash (value: string): Hash {
  if (!HEX_REGEX.test(value) || value.length !== 66) {
    throw new TypeError(`Value "${value}" is not a valid hash`)
  }
  return value.toLowerCase() as Hash
}

/**
 * An hexadecimal string representing an ethereum address.
 * Always prefixed with 0x, always lowercase and of length 42.
 */
export type Address = Opaque<'Address', string>
export function makeAddress (value: string): Address {
  if (!HEX_REGEX.test(value) || value.length !== 42) {
    throw new TypeError(`Value "${value}" is not a valid address`)
  }
  return value.toLowerCase() as Address
}

/**
 * A hexadecimal string representing bytes of data.
 * Always prefixed with 0x, always lowercase.
 */
export type HexData = Opaque<'HexData', string>
export function makeHexData (value: string): HexData {
  if (!HEX_REGEX.test(value) || value.length % 2 !== 0) {
    throw new TypeError(`Value "${value}" is not valid hex data`)
  }
  return value.toLowerCase() as HexData
}

/**
 * A hexadecimal string representing a number.
 * Always prefixed with 0x, always lowercase.
 */
export type Quantity = Opaque<'Quantity', string>
// TODO: makeQuantity (string | BN)

/**
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
