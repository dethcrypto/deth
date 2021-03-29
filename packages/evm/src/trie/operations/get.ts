import { Bytes } from '../../Bytes'
import { TrieBranch, TrieLeaf, TrieNode } from '../nodes'
import { findPath } from './findPath'

export function get(root: TrieNode | undefined, key: Bytes) {
  const path = key.toHex()
  const { stack, found } = findPath(root, path)
  if (found) {
    const last = stack.pop()
    if (last instanceof TrieLeaf || last instanceof TrieBranch) {
      return last.value
    }
  }
  return Bytes.EMPTY
}
