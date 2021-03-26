import { Address } from './Address'
import { rlpEncode } from './rlp'
import { Bytes } from './Bytes'
import { keccak256 } from 'js-sha3'

export function getContractAddress(sender: Address, nonce: number) {
  const encoded = rlpEncode([Bytes.fromHex(sender), Bytes.fromNumber(nonce)])
  return hashToAddress(keccak256(encoded.toByteArray()))
}

function hashToAddress(hash: string) {
  return hash.substring(24) as Address
}
