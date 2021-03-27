import { TrieBranch } from './TrieBranch'
import { TrieExtension } from './TrieExtension'
import { TrieLeaf } from './TrieLeaf'

export type TrieNode = TrieBranch | TrieExtension | TrieLeaf
