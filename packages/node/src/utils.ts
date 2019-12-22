import { utils } from 'ethers'
import { bufferToHex } from 'ethereumjs-util'

export const bufferToAddress = (buffer: Buffer) =>
  utils.getAddress(bufferToHex(buffer))
