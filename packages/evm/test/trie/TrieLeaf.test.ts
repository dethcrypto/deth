import { expect } from 'chai'
import { Bytes } from '../../src/Bytes'
import { InvalidEncoding } from '../../src/encoding'
import { rlpEncode } from '../../src/rlp'
import { TrieLeaf } from '../../src/trie'

describe('TrieLeaf', () => {
  const cases = [
    {
      name: 'empty',
      leaf: new TrieLeaf('', Bytes.EMPTY),
      rlp: 'c22080',
    },
    {
      name: 'shortKey',
      leaf: new TrieLeaf('abc', Bytes.EMPTY),
      rlp: 'c4823abc80',
    },
    {
      name: 'longKey',
      leaf: new TrieLeaf('1234567890abcdef1234567890abcdef', Bytes.EMPTY),
      rlp: 'd391201234567890abcdef1234567890abcdef80',
    },
    {
      name: 'shortValue',
      leaf: new TrieLeaf('abc', Bytes.fromHex('abcdef')),
      rlp: 'c7823abc83abcdef',
    },
    {
      name: 'longValue',
      leaf: new TrieLeaf(
        '1234567890abcdef1234567890abcdef',
        Bytes.fromHex('1234567890abcdef1234567890abcdef')
      ),
      rlp:
        'e391201234567890abcdef1234567890abcdef901234567890abcdef1234567890abcdef',
    },
  ]

  describe('encode', () => {
    for (const { name, leaf, rlp } of cases) {
      it(name, () => {
        const encoded = leaf.encode()
        expect(encoded).to.deep.equal(Bytes.fromHex(rlp))
      })
    }
  })

  describe('decode', () => {
    for (const { name, leaf, rlp } of cases) {
      it(name, () => {
        const decoded = TrieLeaf.decode(Bytes.fromHex(rlp))
        expect(decoded).to.deep.equal(leaf)
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
