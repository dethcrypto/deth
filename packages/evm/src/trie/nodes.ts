import { Bytes } from '../Bytes'
import { keccak } from '../hash'
import { rlpEncode, RlpSerializable } from '../rlp'
import { hexPrefixEncode } from './hexPrefix'

export abstract class TrieNode {
  private cache?: RlpSerializable

  get raw(): RlpSerializable {
    if (!this.cache) {
      const raw = this.getRaw()
      const encoded = rlpEncode(raw)
      if (encoded.length >= 32) {
        this.cache = keccak(encoded)
      } else {
        this.cache = raw
      }
    }
    return this.cache
  }

  getHash() {
    return keccak(rlpEncode(this.getRaw()))
  }

  protected abstract getRaw(): RlpSerializable
}

export class TrieLeaf extends TrieNode {
  constructor(readonly path: string, readonly value: Bytes) {
    super()
  }

  getRaw(): RlpSerializable {
    return [hexPrefixEncode(this.path, true), this.value]
  }
}

export class TrieExtension extends TrieNode {
  constructor(readonly path: string, readonly branch: TrieBranch) {
    super()
  }

  getRaw(): RlpSerializable {
    return [hexPrefixEncode(this.path, false), this.branch.raw]
  }
}

export class TrieBranch extends TrieNode {
  constructor(
    readonly children: readonly (TrieNode | undefined)[],
    readonly value: Bytes
  ) {
    super()
  }

  static from(items: Record<number, TrieNode>, value: Bytes) {
    const children: (TrieNode | undefined)[] = new Array(16).fill(undefined)
    for (const key in items) {
      children[key] = items[key]
    }
    return new TrieBranch(children, value)
  }

  getRaw(): RlpSerializable {
    const ids = this.children.map((x) => x?.raw ?? Bytes.EMPTY)
    return [...ids, this.value]
  }
}
