import { Bytes } from '../../Bytes'
import { TrieBranch, TrieExtension, TrieLeaf, TrieNode } from '../nodes'
import { stackToRoot } from './stackToRoot'

export function remove(
  key: string,
  value: Bytes,
  remaining: string,
  stack: TrieNode[]
) {
  const node = stack.pop()
  if (!node) {
    return undefined
  }

  if (node instanceof TrieBranch) {
    const childCount = node.children.reduce(
      (count, child) => count + (child !== undefined ? 1 : 0),
      0
    )
    if (childCount >= 2) {
      stack.push(new TrieBranch(node.children, Bytes.EMPTY))
    } else {
      const index = node.children.findIndex((x) => x !== undefined)
      const child = node.children[index]
      const parent = stack.pop()
      if (!parent || parent instanceof TrieBranch) {
        if (parent) {
          stack.push(parent)
        }
        const nibble = index.toString(16)
        if (child instanceof TrieBranch) {
          stack.push(new TrieExtension(nibble, child))
        } else if (child instanceof TrieExtension) {
          stack.push(new TrieExtension(nibble + child.path, child.branch))
        } else if (child instanceof TrieLeaf) {
          stack.push(new TrieLeaf(nibble + child.path, child.value))
        }
      } else if (parent instanceof TrieExtension) {
        const path = parent.path + index.toString(16)
        if (child instanceof TrieBranch) {
          stack.push(new TrieExtension(path, child))
        } else if (child instanceof TrieExtension) {
          stack.push(new TrieExtension(path + child.path, child.branch))
        } else if (child instanceof TrieLeaf) {
          stack.push(new TrieLeaf(path + child.path, child.value))
        }
      }
    }
  } else if (node instanceof TrieExtension) {
    return undefined
  }

  return stackToRoot(key, stack)
}
