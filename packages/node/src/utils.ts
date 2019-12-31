import { bufferToHex, BN } from 'ethereumjs-util'
import { Address, makeAddress, HexString, makeHexString, Hash, makeHash, Quantity, makeQuantity } from './model'

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

export function bufferToQuantity (buffer: Buffer): Quantity {
  return bnToQuantity(new BN(buffer))
}

export function bnToQuantity (bn: BN): Quantity {
  return makeQuantity('0x' + bn.toString(16))
}

export function numberToQuantity (number: number): Quantity {
  return makeQuantity('0x' + number.toString(16))
}
