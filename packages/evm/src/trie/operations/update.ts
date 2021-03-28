import { Bytes } from '../../Bytes'
import { TrieBranch, TrieExtension, TrieLeaf, TrieNode } from '../nodes'
import { stackToRoot } from './stackToRoot'

export function update(
  key: string,
  value: Bytes,
  remaining: string,
  stack: TrieNode[]
) {
  const node = stack.pop()
  if (!node) {
    return new TrieLeaf(key, value)
  }

  if (remaining.length === 0) {
    if (node instanceof TrieLeaf && node.path === '') {
      stack.push(new TrieLeaf(node.path, value))
    } else if (node instanceof TrieBranch) {
      stack.push(new TrieBranch(node.children, value))
    } else if (node instanceof TrieExtension) {
      const index = parseInt(node.path[0], 16)
      const child =
        node.path.length > 1
          ? new TrieExtension(node.path.substring(1), node.branch)
          : node.branch
      stack.push(TrieBranch.from({ [index]: child }, value))
    }
  } else if (node instanceof TrieBranch) {
    const path = remaining.substring(1)
    stack.push(node)
    stack.push(new TrieLeaf(path, value))
  } else if (node instanceof TrieLeaf || node instanceof TrieExtension) {
    const common = commonPrefix(remaining, node.path)
    const nodePath = node.path.substring(common.length)
    const remainingPath = remaining.substring(common.length)

    const children: Record<number, TrieNode> = {}
    let branchValue = Bytes.EMPTY

    if (node instanceof TrieLeaf) {
      if (nodePath === '') {
        branchValue = node.value
      } else {
        const index = parseInt(nodePath[0], 16)
        const child = new TrieLeaf(nodePath.substring(1), node.value)
        children[index] = child
      }
    }

    if (node instanceof TrieExtension) {
      if (nodePath === '') {
        for (let i = 0; i < node.branch.children.length; i++) {
          const child = node.branch.children[i]
          if (child) {
            children[i] = child
          }
        }
        branchValue = node.branch.value
      } else {
        const index = parseInt(nodePath[0], 16)
        const path = nodePath.substring(1)
        const child =
          path !== '' ? new TrieExtension(path, node.branch) : node.branch
        children[index] = child
      }
    }

    if (remainingPath === '') {
      branchValue = value
    } else {
      const index = parseInt(remainingPath[0], 16)
      const child = new TrieLeaf(remainingPath.substring(1), value)
      children[index] = child
    }

    const branch = TrieBranch.from(children, branchValue)

    if (common !== '') {
      stack.push(new TrieExtension(common, branch))
    }
    stack.push(branch)
  }

  return stackToRoot(key, stack)
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
