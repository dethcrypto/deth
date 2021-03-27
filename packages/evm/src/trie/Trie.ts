import { Bytes } from '../Bytes'
import { keccak } from '../hash'
import { TrieLeaf } from './TrieLeaf'
import { TrieNode } from './TrieNode'

const EMPTY_ROOT =
  '56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421'

export class Trie {
  private nodes = new Map<string, TrieNode>()
  private root = EMPTY_ROOT

  getRoot(): Bytes {
    return Bytes.fromHex(this.root)
  }

  put(key: Bytes, value: Bytes) {
    if (this.root === EMPTY_ROOT) {
      const node = new TrieLeaf(key.toHex(), value)
      const id = getNodeIdentifier(node, true).toHex()
      this.nodes.set(id, node)
      this.root = id
    }
  }
}

function getNodeIdentifier(node: TrieNode, topLevel = false) {
  const encoded = node.encode()
  if (encoded.length >= 32 || topLevel) {
    return keccak(encoded)
  } else {
    return encoded
  }
}
