import { Bytes } from '../../Bytes'
import { TrieBranch, TrieExtension, TrieLeaf, TrieNode } from '../nodes'
import { stackToRoot } from './stackToRoot'

export function remove(key: string, stack: TrieNode[]) {
  const node = stack.pop()
  if (!node) {
    return undefined
  }

  if (node instanceof TrieBranch) {
    const childCount = getChildCount(node)
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
  } else if (node instanceof TrieLeaf) {
    if (stack.length === 0) {
      return undefined
    }
    const parent = stack.pop()
    if (parent instanceof TrieBranch) {
      const index = parseInt(key[key.length - 1 - node.path.length], 16)
      const childCount = getChildCount(parent)
      const weight = childCount + (parent.value.length !== 0 ? 1 : 0)
      if (weight >= 3) {
        const children = [...parent.children]
        children[index] = undefined
        stack.push(new TrieBranch(children, parent.value))
      } else if (childCount === 1) {
        const grandparent = stack.pop()
        if (!grandparent || grandparent instanceof TrieBranch) {
          if (grandparent) {
            stack.push(grandparent)
          }
          stack.push(new TrieLeaf('', parent.value))
        } else if (grandparent instanceof TrieExtension) {
          stack.push(new TrieLeaf(grandparent.path, parent.value))
        }
      } else {
        const childIndex = parent.children.findIndex(
          (x, i) => !!x && i !== index
        )
        const child = parent.children[childIndex]
        const nibble = childIndex.toString(16)
        const grandparent = stack.pop()
        if (!grandparent || grandparent instanceof TrieBranch) {
          if (grandparent) {
            stack.push(grandparent)
          }
          if (child instanceof TrieLeaf) {
            stack.push(new TrieLeaf(nibble + child.path, child.value))
          } else if (child instanceof TrieBranch) {
            stack.push(new TrieExtension(nibble, child))
          } else if (child instanceof TrieExtension) {
            stack.push(new TrieExtension(nibble + child.path, child.branch))
          }
        } else if (grandparent instanceof TrieExtension) {
          if (child instanceof TrieLeaf) {
            const path = grandparent.path + nibble + child.path
            stack.push(new TrieLeaf(path, child.value))
          } else if (child instanceof TrieExtension) {
            const path = grandparent.path + nibble + child.path
            stack.push(new TrieExtension(path, child.branch))
          } else if (child instanceof TrieBranch) {
            stack.push(new TrieExtension(grandparent.path + nibble, child))
          }
        }
      }
    }
  }

  return stackToRoot(key, stack)
}

function getChildCount(branch: TrieBranch) {
  return branch.children.reduce(
    (count, child) => count + (child !== undefined ? 1 : 0),
    0
  )
}
