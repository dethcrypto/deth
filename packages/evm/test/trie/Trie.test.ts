import { expect } from 'chai'
import { Bytes } from '../../src/Bytes'
import { keccak } from '../../src/hash'
import { rlpEncode } from '../../src/rlp'
import { Trie } from '../../src/trie'
import testCasesAnyOrder from './cases/any-order.json'
import testCasesInOrder from './cases/in-order.json'
import { trieToJSON, trieToNodes } from './utils'

describe('Trie', () => {
  it('has a specific empty hash', () => {
    const expected = keccak(rlpEncode(Bytes.EMPTY))
    expect(new Trie().getRoot()).to.deep.equal(expected)
  })

  describe('any order', () => {
    for (const [name, testCase] of Object.entries(testCasesAnyOrder)) {
      it(name, () => {
        const trie = new Trie()
        for (const [key, value] of Object.entries(testCase.in)) {
          console.log(`${toBytes(key).toHex()} -> ${toBytes(value).toHex()}`)
          trie.set(toBytes(key), toBytes(value))
          console.log(trieToJSON(trie))
        }
        console.log('\n\nTRIE')
        console.log(trieToNodes(trie))
        expect(trie.getRoot()).to.deep.equal(Bytes.fromHex(testCase.root))
      })
    }
  })

  describe('in order', () => {
    for (const [name, testCase] of Object.entries(testCasesInOrder)) {
      it(name, () => {
        const trie = new Trie()
        for (const [key, value] of testCase.in) {
          trie.set(toBytes(key), toBytes(value))
        }
        expect(trie.getRoot()).to.deep.equal(Bytes.fromHex(testCase.root))
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
