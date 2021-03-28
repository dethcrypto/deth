import { Bytes } from '../Bytes'
import { TrieNode } from './nodes'
import { set } from './operations'

const EMPTY_ROOT = Bytes.fromHex(
  '56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421'
)

export class Trie {
  private rootHash?: Bytes = EMPTY_ROOT
  private rootNode?: TrieNode

  get root(): Bytes {
    if (!this.rootHash) {
      this.rootHash = this.rootNode ? this.rootNode.getHash() : EMPTY_ROOT
    }
    return this.rootHash
  }

  private setRootNode(node?: TrieNode) {
    this.rootNode = node
    this.rootHash = undefined
  }

  set(key: Bytes, value: Bytes) {
    this.setRootNode(set(this.rootNode, key, value))
  }

  delete(key: Bytes) {
    this.set(key, Bytes.EMPTY)
  }
}
