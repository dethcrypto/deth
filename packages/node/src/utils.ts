import { utils } from 'ethers'
import { bufferToHex } from 'ethereumjs-util'
import { Address } from './model'

export function bufferToAddress (buffer: Buffer): Address {
  return utils.getAddress(bufferToHex(buffer))
}

export function bufferToMaybeAddress (buffer?: Buffer): Address | undefined {
  return buffer && buffer.length > 0
    ? bufferToAddress(buffer)
    : undefined
}
