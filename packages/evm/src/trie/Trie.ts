import { Bytes } from '../Bytes'
import { TrieNode } from './nodes'
import { get, set, JsonNode, fromJson, toJson } from './operations'

const EMPTY_ROOT = Bytes.fromHex(
  '56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421'
)

export class Trie {
  private rootHash?: Bytes
  private rootNode?: TrieNode

  protected constructor(value?: Trie | TrieNode) {
    this.rootNode = value instanceof Trie ? value.rootNode : value
  }

  static EMPTY = new Trie(undefined)

  static fromJson(value: JsonNode | undefined) {
    return new Trie(fromJson(value))
  }

  toJson() {
    return toJson(this.rootNode)
  }

  get root(): Bytes {
    if (!this.rootHash) {
      this.rootHash = this.rootNode ? this.rootNode.getHash() : EMPTY_ROOT
    }
    return this.rootHash
  }

  get(key: Bytes): Bytes {
    return get(this.rootNode, key)
  }

  set(key: Bytes, value: Bytes) {
    return new Trie(set(this.rootNode, key, value))
  }

  remove(key: Bytes) {
    return this.set(key, Bytes.EMPTY)
  }
}
