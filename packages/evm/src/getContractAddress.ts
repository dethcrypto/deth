import { Address } from './Address'
import { rlpEncode } from './rlp'
import { Bytes } from './Bytes'
import { keccak256 } from 'js-sha3'

export function getContractAddress(sender: Address, nonce: number) {
  const bytes = rlpEncode([addressToBytes(sender), Bytes.fromNumber(nonce)])
  return hashToAddress(keccak256(bytes.toByteArray()))
}

function addressToBytes(value: Address) {
  return Bytes.fromHex(value)
}

function hashToAddress(hash: string) {
  return hash.substring(24) as Address
}
