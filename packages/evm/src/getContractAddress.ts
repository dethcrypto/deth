import { Address } from './Address'
import { rlpEncode, rlpEncodeNumber } from './rlp'
import { Bytes } from './Bytes'
import { keccak256 } from 'js-sha3'

export function getContractAddress(sender: Address, nonce: number) {
  const bytes = rlpEncode([addressToBytes(sender), rlpEncodeNumber(nonce)])
  return hashToAddress(keccak256(bytes.toByteIntArray()))
}

function addressToBytes(value: Address) {
  return Bytes.fromString(value)
}

function hashToAddress(hash: string) {
  return hash.substring(24) as Address
}
