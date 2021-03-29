import { Bytes } from '../../Bytes'
import { TrieBranch, TrieExtension, TrieLeaf, TrieNode } from '../nodes'

export type JsonNode = JsonLeaf | JsonBranch | JsonExtension

export interface JsonLeaf {
  type: 'Leaf'
  path: string
  value: string
}

interface JsonChildren {
  0?: JsonNode
  1?: JsonNode
  2?: JsonNode
  3?: JsonNode
  4?: JsonNode
  5?: JsonNode
  6?: JsonNode
  7?: JsonNode
  8?: JsonNode
  9?: JsonNode
  a?: JsonNode
  b?: JsonNode
  c?: JsonNode
  d?: JsonNode
  e?: JsonNode
  f?: JsonNode
}

export interface JsonBranch extends JsonChildren {
  type: 'Branch'
  value?: string
}

export interface JsonExtension {
  type: 'Extension'
  path: string
  branch: JsonBranch
}

export function toJson(node: TrieNode | undefined): JsonNode | undefined {
  if (node instanceof TrieLeaf) {
    return { type: 'Leaf', path: node.path, value: node.value.toHex() }
  } else if (node instanceof TrieExtension) {
    return {
      type: 'Extension',
      path: node.path,
      branch: toJson(node.branch) as JsonBranch,
    }
  } else if (node instanceof TrieBranch) {
    const result: JsonBranch = { type: 'Branch' }
    for (let i = 0; i < 16; i++) {
      const child = node.children[i]
      if (child) {
        result[i.toString(16) as keyof JsonChildren] = toJson(child)
      }
    }
    if (node.value.length !== 0) {
      result.value = node.value.toHex()
    }
    return result
  }
}

export function fromJson(json: JsonNode | undefined): TrieNode | undefined {
  if (!json) {
    return undefined
  }
  switch (json.type) {
    case 'Leaf':
      return new TrieLeaf(json.path, Bytes.fromHex(json.value))
    case 'Extension':
      return new TrieExtension(json.path, fromJson(json.branch) as TrieBranch)
    case 'Branch':
      const children = '0123456789abcdef'
        .split('')
        .map((x) => fromJson(json[x as keyof JsonChildren]))
      return new TrieBranch(children, Bytes.fromHex(json.value ?? ''))
  }
}
