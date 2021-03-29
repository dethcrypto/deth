import { keccak256 } from 'js-sha3'
import { Bytes } from './Bytes'

export function keccak(value: Bytes) {
  return Bytes.fromHex(keccak256(value.toByteArray()))
}
