import { Bytes } from '../../Bytes'
import { TrieNode } from '../nodes'
import { findPath } from './findPath'
import { remove } from './remove'
import { update } from './update'

export function set(root: TrieNode | undefined, key: Bytes, value: Bytes) {
  const path = key.toHex()
  const { remaining, stack, found } = findPath(root, path)
  if (value.length !== 0) {
    return update(path, value, remaining, stack)
  } else if (!found) {
    return root
  } else {
    return remove(path, value, remaining, stack)
  }
}
