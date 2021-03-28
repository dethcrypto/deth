import { expect } from 'chai'
import { Bytes } from '../../src/Bytes'
import { keccak } from '../../src/hash'
import { rlpEncode } from '../../src/rlp'
import { Trie } from '../../src/trie'
import testCasesAnyOrder from './cases/any-order.json'
import testCasesInOrder from './cases/in-order.json'

describe('Trie', () => {
  it('has a specific empty hash', () => {
    const expected = keccak(rlpEncode(Bytes.EMPTY))
    expect(new Trie().root).to.deep.equal(expected)
  })

  describe('removing', () => {
    it('branch with 2+ children', () => {
      const trie = Trie.fromJson({
        // to remove
        type: 'Branch',
        0: { type: 'Leaf', path: '0', value: '1234' },
        1: { type: 'Leaf', path: '1', value: 'abcd' },
        value: '1a2b',
      })
      trie.delete(Bytes.fromHex(''))
      const expected = Trie.fromJson({
        // value removed
        type: 'Branch',
        0: { type: 'Leaf', path: '0', value: '1234' },
        1: { type: 'Leaf', path: '1', value: 'abcd' },
      })
      expect(trie).to.deep.equal(expected)
    })

    it('branch with 1 child and no parent', () => {
      const trie = Trie.fromJson({
        // to remove
        type: 'Branch',
        0: { type: 'Leaf', path: '0', value: '1234' },
        value: '1a2b',
      })
      trie.delete(Bytes.fromHex(''))
      const expected = Trie.fromJson({
        // replaced with leaf
        type: 'Leaf',
        path: '00',
        value: '1234',
      })
      expect(trie).to.deep.equal(expected)
    })

    it('branch with 1 branch child and branch parent', () => {
      const trie = Trie.fromJson({
        type: 'Extension',
        path: '0',
        branch: {
          type: 'Branch',
          0: {
            // to remove
            type: 'Branch',
            0: {
              type: 'Branch',
              0: { type: 'Leaf', path: '0', value: '1234' },
              1: { type: 'Leaf', path: '1', value: 'abcd' },
            },
            value: '1a2b',
          },
          1: { type: 'Leaf', path: '1', value: 'abcd' },
        },
      })
      trie.delete(Bytes.fromHex('00'))
      const expected = Trie.fromJson({
        type: 'Extension',
        path: '0',
        branch: {
          type: 'Branch',
          0: {
            // replaced with extension
            type: 'Extension',
            path: '0',
            branch: {
              type: 'Branch',
              0: { type: 'Leaf', path: '0', value: '1234' },
              1: { type: 'Leaf', path: '1', value: 'abcd' },
            },
          },
          1: { type: 'Leaf', path: '1', value: 'abcd' },
        },
      })
      expect(trie).to.deep.equal(expected)
    })

    it('branch with 1 extension child and branch parent', () => {
      const trie = Trie.fromJson({
        type: 'Extension',
        path: '0',
        branch: {
          type: 'Branch',
          0: {
            // to remove
            type: 'Branch',
            0: {
              type: 'Extension',
              path: '0',
              branch: {
                type: 'Branch',
                0: { type: 'Leaf', path: '0', value: '1234' },
                1: { type: 'Leaf', path: '1', value: 'abcd' },
              },
            },
            value: '1a2b',
          },
          1: { type: 'Leaf', path: '1', value: 'abcd' },
        },
      })
      trie.delete(Bytes.fromHex('00'))
      const expected = Trie.fromJson({
        type: 'Extension',
        path: '0',
        branch: {
          type: 'Branch',
          0: {
            // extended child
            type: 'Extension',
            path: '00',
            branch: {
              type: 'Branch',
              0: { type: 'Leaf', path: '0', value: '1234' },
              1: { type: 'Leaf', path: '1', value: 'abcd' },
            },
          },
          1: { type: 'Leaf', path: '1', value: 'abcd' },
        },
      })
      expect(trie).to.deep.equal(expected)
    })

    it('branch with 1 leaf child and branch parent', () => {
      const trie = Trie.fromJson({
        type: 'Extension',
        path: '0',
        branch: {
          type: 'Branch',
          0: {
            // to remove
            type: 'Branch',
            0: { type: 'Leaf', path: '0', value: '1234' },
            value: '1a2b',
          },
          1: { type: 'Leaf', path: '1', value: 'abcd' },
        },
      })
      trie.delete(Bytes.fromHex('00'))
      const expected = Trie.fromJson({
        type: 'Extension',
        path: '0',
        branch: {
          type: 'Branch',
          // extended child
          0: { type: 'Leaf', path: '00', value: '1234' },
          1: { type: 'Leaf', path: '1', value: 'abcd' },
        },
      })
      expect(trie).to.deep.equal(expected)
    })
  })

  describe('any order', () => {
    for (const [name, testCase] of Object.entries(testCasesAnyOrder)) {
      it(name, () => {
        const trie = new Trie()
        for (const [key, value] of Object.entries(testCase.in)) {
          trie.set(toBytes(key), toBytes(value))
        }
        expect(trie.root).to.deep.equal(Bytes.fromHex(testCase.root))
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
