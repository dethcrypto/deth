import { rlpEncode } from '../../src/rlp'
import { Trie } from '../../src/trie'
import {
  TrieBranch,
  TrieExtension,
  TrieLeaf,
  TrieNode,
} from '../../src/trie/nodes'

export function trieToJSON(trie: Trie) {
  function nodeToJSON(node: TrieNode): any {
    if (node instanceof TrieLeaf) {
      return { type: 'Leaf', path: node.path, value: node.value.toHex() }
    } else if (node instanceof TrieExtension) {
      return {
        type: 'Extension',
        path: node.path,
        child: nodeToJSON(node.branch),
      }
    } else if (node instanceof TrieBranch) {
      const result: any = { type: 'Branch' }
      for (let i = 0; i < 16; i++) {
        const child = node.children[i]
        if (child) {
          result[i.toString(16)] = nodeToJSON(child)
        }
      }
      if (node.value.length !== 0) {
        result.value = node.value.toHex()
      }
      return result
    }
  }
  const root = trie['rootNode']
  return JSON.stringify(root && nodeToJSON(root), null, 2)
}

export function trieToNodes(trie: Trie) {
  const nodes: string[] = []

  function addNodes(node: TrieNode, key: string) {
    addNode(node, key)
    if (node instanceof TrieExtension) {
      addNodes(node.branch, key + node.path)
    } else if (node instanceof TrieBranch) {
      for (let i = 0; i < 16; i++) {
        const child = node.children[i]
        if (child) {
          addNodes(child, key + i.toString(16))
        }
      }
    }
  }

  function addNode(node: TrieNode, key: string) {
    let type = 'Leaf'
    if (node instanceof TrieBranch) {
      type = 'Branch'
    }
    if (node instanceof TrieExtension) {
      type = 'Extension'
    }
    console.log(`${key} -> ${type} ${rlpEncode(node.raw).toHex()}`)
  }

  const root = trie['rootNode']
  root && addNodes(root, '')

  return nodes.join('\n')
}
