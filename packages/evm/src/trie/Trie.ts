import { Bytes } from '../Bytes'
import { TrieNode, TrieBranch, TrieExtension, TrieLeaf } from './nodes'

const EMPTY_ROOT = Bytes.fromHex(
  '56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421'
)

export class Trie {
  private root?: Bytes = EMPTY_ROOT
  private rootNode?: TrieNode

  getRoot(): Bytes {
    if (!this.root) {
      this.root = this.rootNode ? this.rootNode.getHash() : EMPTY_ROOT
    }
    return this.root
  }

  private setRootNode(node?: TrieNode) {
    this.rootNode = node
    this.root = undefined
  }

  set(key: Bytes, value: Bytes) {
    if (this.root === EMPTY_ROOT) {
      this.setRootNode(new TrieLeaf(key.toHex(), value))
    } else {
      const { remaining, stack } = this.findPath(key)
      this.updateNode(key, value, remaining, stack)
    }
  }

  private findPath(key: Bytes) {
    const remaining = key.toHex()
    if (!this.rootNode) {
      return { remaining, stack: [] }
    }
    return this.findPathInner(this.rootNode, remaining, [])
  }

  private findPathInner(
    node: TrieNode,
    remaining: string,
    stack: TrieNode[]
  ): { remaining: string; stack: TrieNode[] } {
    console.log('findPathInner, remaining', remaining)
    stack.push(node)
    if (node instanceof TrieLeaf) {
      console.log('TrieLeaf:', node.path)
      if (remaining === node.path) {
        console.log('BINGO!')
        return { remaining: '', stack }
      }
    } else if (node instanceof TrieExtension) {
      console.log('TrieExtension: ', node.path)
      if (remaining.startsWith(node.path)) {
        console.log('BINGO!')
        return this.findPathInner(
          node.branch,
          remaining.substring(node.path.length),
          stack
        )
      }
    } else if (node instanceof TrieBranch) {
      console.log('TrieBranch')
      if (remaining !== '') {
        const index = parseInt(remaining[0], 16)
        const child = node.children[index]
        if (child) {
          console.log('BINGO!')
          return this.findPathInner(child, remaining.substring(1), stack)
        }
      }
    }
    return { remaining, stack }
  }

  private updateNode(
    key: Bytes,
    value: Bytes,
    remaining: string,
    stack: TrieNode[]
  ) {
    const node = stack.pop()
    if (!node) {
      throw new Error('Stack underflow')
    }

    if (remaining.length === 0) {
      console.log('NOTHING REMAINING')
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
      console.log('REMAINING TrieBranch', remaining)
      const path = remaining.substring(1)
      stack.push(node)
      stack.push(new TrieLeaf(path, value))
    } else if (node instanceof TrieLeaf || node instanceof TrieExtension) {
      console.log('REMAINING L/E', remaining)
      const common = commonPrefix(remaining, node.path)
      const nodePath = node.path.substring(common.length)
      const remainingPath = remaining.substring(common.length)

      const children: Record<number, TrieNode> = {}
      let branchValue = Bytes.EMPTY

      if (node instanceof TrieLeaf) {
        if (nodePath === '') {
          console.log('BRANCHVALUE NODEVALUE')
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

    this.updateStack(key, stack)
  }

  private updateStack(key: Bytes, stack: TrieNode[]) {
    const path = key.toHex()
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
    for (let i = stack.length - 2; i >= 0; i--) {
      const next = stack[i + 1]
      const current = stack[i]
      if (current instanceof TrieBranch) {
        const key = indices[i + 1]
        const children = [...current.children]
        children[key] = next
        stack[i] = new TrieBranch(children, current.value)
      } else if (current instanceof TrieExtension) {
        if (!(next instanceof TrieBranch)) {
          throw new Error('Invalid stack')
        } else {
          stack[i] = new TrieExtension(current.path, next)
        }
      }
    }
    this.setRootNode(stack[0])
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
