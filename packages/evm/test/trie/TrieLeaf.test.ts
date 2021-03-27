import { expect } from 'chai'
import { Bytes } from '../../src/Bytes'
import { InvalidEncoding } from '../../src/encoding'
import { rlpEncode } from '../../src/rlp'
import { TrieLeaf } from '../../src/trie'

describe('TrieLeaf', () => {
  const cases = [
    {
      name: 'empty',
      node: new TrieLeaf('', Bytes.EMPTY),
      rlp: 'c22080',
    },
    {
      name: 'keyShort',
      node: new TrieLeaf('abc', Bytes.EMPTY),
      rlp: 'c4823abc80',
    },
    {
      name: 'key32',
      node: new TrieLeaf('ff'.repeat(32), Bytes.EMPTY),
      rlp:
        'e3a120ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff80',
    },
    {
      name: 'key33',
      node: new TrieLeaf('ff'.repeat(33), Bytes.EMPTY),
      rlp:
        'e4a220ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff80',
    },
    {
      name: 'valueShort',
      node: new TrieLeaf('abc', Bytes.fromHex('abcdef')),
      rlp: 'c7823abc83abcdef',
    },
    {
      name: 'value32',
      node: new TrieLeaf('abc', Bytes.fromHex('ff'.repeat(32))),
      rlp:
        'e4823abca0ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
    },
    {
      name: 'value33',
      node: new TrieLeaf('abc', Bytes.fromHex('ff'.repeat(33))),
      rlp:
        'e5823abca1ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
    },
  ]

  describe('encode', () => {
    for (const { name, node, rlp } of cases) {
      it(name, () => {
        const encoded = node.encode()
        expect(encoded).to.deep.equal(Bytes.fromHex(rlp))
      })
    }
  })

  describe('decode', () => {
    for (const { name, node, rlp } of cases) {
      it(name, () => {
        const decoded = TrieLeaf.decode(Bytes.fromHex(rlp))
        expect(decoded).to.deep.equal(node)
      })
    }

    it('fails for not an array', () => {
      const encoded = rlpEncode(Bytes.fromHex('1234'))
      expect(() => TrieLeaf.decode(encoded)).to.throw(InvalidEncoding)
    })

    it('fails for a short array', () => {
      const encoded = rlpEncode([Bytes.fromHex('1234')])
      expect(() => TrieLeaf.decode(encoded)).to.throw(InvalidEncoding)
    })

    it('fails for a long array', () => {
      const encoded = rlpEncode([
        Bytes.fromHex('1234'),
        Bytes.fromHex('1234'),
        Bytes.fromHex('1234'),
      ])
      expect(() => TrieLeaf.decode(encoded)).to.throw(InvalidEncoding)
    })

    it('fails for first item not bytes', () => {
      const encoded = rlpEncode([[], Bytes.fromHex('1234')])
      expect(() => TrieLeaf.decode(encoded)).to.throw(InvalidEncoding)
    })

    it('fails for second item not bytes', () => {
      const encoded = rlpEncode([Bytes.fromHex('1234'), []])
      expect(() => TrieLeaf.decode(encoded)).to.throw(InvalidEncoding)
    })

    it('fails for first item invalid hex prefix', () => {
      const encoded = rlpEncode([Bytes.fromHex('0123'), Bytes.fromHex('1234')])
      expect(() => TrieLeaf.decode(encoded)).to.throw(InvalidEncoding)
    })

    it('fails for first item invalid flag', () => {
      const encoded = rlpEncode([Bytes.fromHex('0012'), Bytes.fromHex('1234')])
      expect(() => TrieLeaf.decode(encoded)).to.throw(InvalidEncoding)
    })
  })
})
