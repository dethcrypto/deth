import { Address } from './Address'
import { Tuple, rlpEncode, rlpEncodeNumber } from './rlp'
import { Byte } from './Byte'
import { keccak256 } from 'js-sha3'

export function getContractAddress (sender: Address, nonce: number) {
  const bytes = rlpEncode(new Tuple([
    addressToBytes(sender),
    rlpEncodeNumber(nonce),
  ]))
  return hashToAddress(keccak256(bytes))
}

function addressToBytes (value: Address) {
  return value.match(/../g)!.map(x => parseInt(x, 16) as Byte)
}

function hashToAddress (hash: string) {
  return hash.substring(24) as Address
}
