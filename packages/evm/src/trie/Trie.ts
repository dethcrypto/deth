import { Bytes } from '../Bytes'
import { keccak } from '../hash'
import { TrieBranch } from './TrieBranch'
import { TrieExtension } from './TrieExtension'
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

  set(key: Bytes, value: Bytes) {
    if (this.root === EMPTY_ROOT) {
      this.insertFirstNode(key, value)
    } else {
      const { remaining, stack } = this.findPath(key)
      this.updateNode(key, value, remaining, stack)
    }
  }

  private insertFirstNode(key: Bytes, value: Bytes) {
    const node = new TrieLeaf(key.toHex(), value)
    const id = getNodeIdentifier(node, true).toHex()
    this.nodes.set(id, node)
    this.root = id
  }

  private findPath(key: Bytes) {
    const remaining = key.toHex()
    const node = this.nodes.get(this.root)
    if (!node) {
      return { remaining, stack: [] }
    }
    return this.findPathInner(node, remaining, [])
  }

  private findPathInner(
    node: TrieNode,
    remaining: string,
    stack: TrieNode[]
  ): { remaining: string; stack: TrieNode[] } {
    stack.push(node)
    if (node instanceof TrieLeaf) {
      if (remaining === node.path) {
        return { remaining: '', stack }
      } else {
        return { remaining, stack }
      }
    } else if (node instanceof TrieExtension) {
      if (remaining.startsWith(node.path)) {
        const childId = node.value.toHex()
        const child = this.nodes.get(childId)
        if (!child) {
          throw new Error('Trie corrupted')
        }
        return this.findPathInner(
          child,
          remaining.substring(node.path.length),
          stack
        )
      } else {
        return { remaining, stack }
      }
    } else if (node instanceof TrieBranch) {
      if (remaining === '') {
        return { remaining, stack }
      }
      const index = parseInt(remaining[0], 16)
      const childId = node.children[index].toHex()
      const child = this.nodes.get(childId)
      if (!child) {
        return { remaining, stack }
      }
      return this.findPathInner(child, remaining.substring(1), stack)
    }
    return { remaining, stack }
  }

  private updateNode(
    key: Bytes,
    value: Bytes,
    remaining: string,
    stack: TrieNode[]
  ) {
    const lastNode = stack.pop()
    if (!lastNode) {
      throw new Error('Stack underflow')
    }

    if (remaining.length === 0) {
      if (lastNode instanceof TrieExtension) {
        throw new Error('Trie corrupted')
      }
      stack.push(lastNode.setValue(value))
    } else if (lastNode instanceof TrieBranch) {
      const path = remaining.substring(1)
      stack.push(lastNode)
      stack.push(new TrieLeaf(path, value))
    } else {
    }
  }
}

function commonPrefix(a: string, b: string) {
  const len = Math.min(a.length, b.length)
  let prefix = ''
  for (let i = 0; i < len; i++) {
    if (a[i] !== b[i]) {
      break
    }
    prefix += a[i]
  }
  return prefix
}

function getNodeIdentifier(node: TrieNode, topLevel = false) {
  const encoded = node.encode()
  if (encoded.length >= 32 || topLevel) {
    return keccak(encoded)
  } else {
    return encoded
  }
}
