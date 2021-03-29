import { expect } from 'chai'
import { Bytes } from '../../src/Bytes'
import { keccak } from '../../src/hash'
import { rlpEncode } from '../../src/rlp'
import { Trie } from '../../src/trie'
import testCasesAnyOrder from './cases/any-order.json'
import testCasesInOrder from './cases/in-order.json'

describe('Trie reference', () => {
  it('has a specific empty hash', () => {
    const expected = keccak(rlpEncode(Bytes.EMPTY))
    expect(Trie.EMPTY.root).to.deep.equal(expected)
  })

  describe('any order', () => {
    for (const [name, testCase] of Object.entries(testCasesAnyOrder)) {
      it(name, () => {
        let trie = Trie.EMPTY
        for (const [key, value] of Object.entries(testCase.in)) {
          trie = trie.set(toBytes(key), toBytes(value))
        }
        expect(trie.root).to.deep.equal(Bytes.fromHex(testCase.root))
      })
    }
  })

  describe('in order', () => {
    for (const [name, testCase] of Object.entries(testCasesInOrder)) {
      it(name, () => {
        let trie = Trie.EMPTY
        for (const [key, value] of testCase.in) {
          trie = trie.set(toBytes(key), toBytes(value))
        }
        expect(trie.root).to.deep.equal(Bytes.fromHex(testCase.root))
      })
    }
  })
})

function toBytes(value: string | null) {
  if (value && value.startsWith('0x')) {
    return Bytes.fromHex(value)
  }
  return Bytes.fromByteArray(
    (value ?? '').split('').map((x) => x.charCodeAt(0))
  )
}
