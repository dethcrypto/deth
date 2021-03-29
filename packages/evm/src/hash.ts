import { keccak256 } from 'ethereum-cryptography/keccak'
import { Bytes } from './Bytes'

export function keccak(value: Bytes) {
  const buffer = Buffer.from(value.toHex(), 'hex')
  return Bytes.fromHex(keccak256(buffer).toString('hex'))
}
