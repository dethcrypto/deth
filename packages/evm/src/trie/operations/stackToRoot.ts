import { TrieBranch, TrieExtension, TrieLeaf, TrieNode } from '../nodes'

export function stackToRoot(
  path: string,
  stack: TrieNode[]
): TrieNode | undefined {
  const indices = getIndices(path, stack)

  for (let i = stack.length - 2; i >= 0; i--) {
    const next = stack[i + 1]
    const current = stack[i]
    if (current instanceof TrieBranch) {
      const key = indices[i + 1]
      const children = [...current.children]
      children[key] = next
      stack[i] = new TrieBranch(children, current.value)
    } else if (current instanceof TrieExtension) {
      // should always be true
      if (next instanceof TrieBranch) {
        stack[i] = new TrieExtension(current.path, next)
      }
    }
  }

  return stack[0]
}

function getIndices(path: string, stack: TrieNode[]) {
  const indices: number[] = []
  let pathPosition = -1
  for (const item of stack) {
    indices.push(parseInt(path[pathPosition] ?? '0', 16))
    if (item instanceof TrieExtension || item instanceof TrieLeaf) {
      pathPosition += item.path.length
    } else if (item instanceof TrieBranch) {
      pathPosition += 1
    }
  }
  return indices
}
