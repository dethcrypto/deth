import { Bytes } from '../Bytes'
import { keccak } from '../hash'
import { JsonNode } from './operations'
import { Trie } from './Trie'

export class SecureTrie extends Trie {
  static EMPTY = new SecureTrie(undefined)

  static fromJson(value: JsonNode | undefined) {
    return new SecureTrie(Trie.fromJson(value))
  }

  get(key: Bytes): Bytes {
    return super.get(keccak(key))
  }

  set(key: Bytes, value: Bytes) {
    return new SecureTrie(super.set(keccak(key), value))
  }

  remove(key: Bytes) {
    return new SecureTrie(super.remove(keccak(key)))
  }
}
