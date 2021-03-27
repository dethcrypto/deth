import { Address } from './Address'
import { Bytes } from './Bytes'
import { keccak } from './hash'
import { rlpEncode } from './rlp'

export function getContractAddress(sender: Address, nonce: number) {
  const encoded = rlpEncode([Bytes.fromHex(sender), Bytes.fromNumber(nonce)])
  return hashToAddress(keccak(encoded))
}

function hashToAddress(hash: Bytes) {
  return hash.toHex().substring(24) as Address
}
