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
export type BlockTag = string

/**
 * A hexadecimal string representing a hash. Always lower-cased and of length 66.
 */
export type Hash = string

/**
 * An ethereum address. Always normalized through `utils.getAddress`
 */
export type Address = string

/**
 * A hexadecimal string
 */
export type HexString = string
