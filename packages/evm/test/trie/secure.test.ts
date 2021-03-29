import { expect } from 'chai'
import { Bytes } from '../../src/Bytes'
import { SecureTrie, Trie } from '../../src/trie'
import testCasesAnyOrder from './cases/secure-any-order.json'
import testCasesInOrder from './cases/secure-in-order.json'
import testCasesHexEncoded from './cases/secure-hex-encoded.json'

describe('SecureTrie reference', () => {
  it('has the same empty root as trie', () => {
    expect(Trie.EMPTY.root).to.deep.equal(SecureTrie.EMPTY.root)
  })

  describe('hex encoded', () => {
    for (const [name, testCase] of Object.entries(testCasesHexEncoded)) {
      it(name, () => {
        let trie = SecureTrie.EMPTY
        for (const [key, value] of Object.entries(testCase.in)) {
          trie = trie.set(toBytes(key), toBytes(value))
        }
        expect(trie.root).to.deep.equal(Bytes.fromHex(testCase.root))
      })
    }
  })

  describe('any order', () => {
    for (const [name, testCase] of Object.entries(testCasesAnyOrder)) {
      it(name, () => {
        let trie = SecureTrie.EMPTY
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
        let trie = SecureTrie.EMPTY
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
