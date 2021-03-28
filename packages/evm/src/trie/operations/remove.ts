import { Bytes } from '../../Bytes'
import { TrieBranch, TrieExtension, TrieLeaf, TrieNode } from '../nodes'
import { stackToRoot } from './stackToRoot'

export function remove(
  key: string,
  value: Bytes,
  remaining: string,
  stack: TrieNode[]
) {
  return stackToRoot(key, [])
}
