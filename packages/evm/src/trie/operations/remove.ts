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
      const { child, nibble } = findChild(node.children)
      insertChild(stack, child, nibble)
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
        insertChild(stack, new TrieLeaf('', parent.value), '')
      } else {
        const { child, nibble } = findChild(parent.children, index)
        insertChild(stack, child, nibble)
      }
    }
  }

  return stackToRoot(key, stack)
}

function insertChild(stack: TrieNode[], child: TrieNode, path: string) {
  const parent = stack.pop()
  if (parent instanceof TrieBranch) {
    stack.push(parent)
  }
  if (parent instanceof TrieExtension) {
    path = parent.path + path
  }
  stack.push(extended(path, child))
}

function findChild(
  children: readonly (TrieNode | undefined)[],
  omitIndex?: number
) {
  const childIndex = children.findIndex((x, i) => !!x && i !== omitIndex)
  return {
    child: children[childIndex] as TrieNode,
    nibble: childIndex.toString(16),
  }
}

function extended(path: string, child: TrieNode) {
  if (child instanceof TrieBranch) {
    return new TrieExtension(path, child)
  } else if (child instanceof TrieLeaf) {
    return new TrieLeaf(path + child.path, child.value)
  } else if (child instanceof TrieExtension) {
    return new TrieExtension(path + child.path, child.branch)
  } else {
    throw new Error('Invalid node')
  }
}

function getChildCount(branch: TrieBranch) {
  return branch.children.reduce(
    (count, child) => count + (child !== undefined ? 1 : 0),
    0
  )
}
