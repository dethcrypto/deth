import { keccak256 } from 'ethereum-cryptography/keccak'
import { Bytes } from './Bytes'

export function keccak(value: Bytes) {
  return Bytes.fromBuffer(keccak256(value.toBuffer()))
}
