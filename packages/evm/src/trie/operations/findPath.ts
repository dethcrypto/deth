import { TrieBranch, TrieExtension, TrieLeaf, TrieNode } from '../nodes'

export function findPath(node: TrieNode | undefined, path: string) {
  if (!node) {
    return { remaining: path, stack: [], found: false }
  }
  return findPathInner(node, path, [])
}

function findPathInner(
  node: TrieNode,
  remaining: string,
  stack: TrieNode[]
): { remaining: string; stack: TrieNode[]; found: boolean } {
  stack.push(node)
  if (node instanceof TrieLeaf) {
    if (remaining === node.path) {
      return { remaining: '', stack, found: true }
    }
  } else if (node instanceof TrieExtension) {
    if (remaining.startsWith(node.path)) {
      return findPathInner(
        node.branch,
        remaining.substring(node.path.length),
        stack
      )
    }
  } else if (node instanceof TrieBranch) {
    if (remaining === '') {
      return { remaining, stack, found: true }
    } else {
      const index = parseInt(remaining[0], 16)
      const child = node.children[index]
      if (child) {
        return findPathInner(child, remaining.substring(1), stack)
      }
    }
  }
  return { remaining, stack, found: false }
}
