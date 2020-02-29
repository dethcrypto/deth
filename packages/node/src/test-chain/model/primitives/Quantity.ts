import { Opaque } from 'ts-essentials'
import { BN } from 'ethereumjs-util'
// eslint-disable-next-line
import { BigNumber } from 'ethers/utils'

const HEX_NO_LEADING_ZERO_REGEX = /^0x[1-9a-fA-F][\da-fA-F]*$/

/**
 * A hexadecimal string representing a number.
 * Always prefixed with 0x, always lowercase.
 * Does not have leading zeroes, except when representing 0 - `"0x0"`.
 */
export type Quantity = Opaque<'Quantity', string>
export function makeQuantity (value: string): Quantity {
  if (value === '0x' || value === '0x0') {
    return '0x0' as Quantity
  }
  if (!HEX_NO_LEADING_ZERO_REGEX.test(value)) {
    throw new TypeError(`Value "${value}" is not a valid hex number (leading zeroes)`)
  }
  return value.toLowerCase() as Quantity
}

export function bufferToQuantity (buffer: Buffer): Quantity {
  return bnToQuantity(new BN(buffer))
}

export function bnToQuantity (bn: BN): Quantity {
  return makeQuantity('0x' + bn.toString(16))
}

export function numberToQuantity (number: number): Quantity {
  return makeQuantity('0x' + number.toString(16))
}

/**
 * NOTE: this might throw when dealing with big number
 */
export function quantityToNumber (quantity: Quantity) {
  return new BigNumber(quantity).toNumber()
}
