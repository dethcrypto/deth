import { expect } from 'chai'
import { Bytes } from '../../src/Bytes'
import { InvalidEncoding } from '../../src/encoding'
import { rlpEncode } from '../../src/rlp'
import { TrieExtension } from '../../src/trie'

describe('TrieExtension', () => {
  const cases = [
    {
      name: 'keyShort',
      node: new TrieExtension('abc', Bytes.EMPTY),
      rlp: 'c4821abc80',
    },
    {
      name: 'key32',
      node: new TrieExtension('ff'.repeat(32), Bytes.EMPTY),
      rlp:
        'e3a100ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff80',
    },
    {
      name: 'key33',
      node: new TrieExtension('ff'.repeat(33), Bytes.EMPTY),
      rlp:
        'e4a200ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff80',
    },
    {
      name: 'valueShort',
      node: new TrieExtension('abc', Bytes.fromHex('abcdef')),
      rlp: 'c7821abc83abcdef',
    },
    {
      name: 'value32',
      node: new TrieExtension('abc', Bytes.fromHex('ff'.repeat(32))),
      rlp:
        'e4821abca0ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
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
        const decoded = TrieExtension.decode(Bytes.fromHex(rlp))
        expect(decoded).to.deep.equal(node)
      })
    }

    it('fails for not an array', () => {
      const encoded = rlpEncode(Bytes.fromHex('1234'))
      expect(() => TrieExtension.decode(encoded)).to.throw(InvalidEncoding)
    })

    it('fails for a short array', () => {
      const encoded = rlpEncode([Bytes.fromHex('1234')])
      expect(() => TrieExtension.decode(encoded)).to.throw(InvalidEncoding)
    })

    it('fails for a long array', () => {
      const encoded = rlpEncode([
        Bytes.fromHex('1234'),
        Bytes.fromHex('1234'),
        Bytes.fromHex('1234'),
      ])
      expect(() => TrieExtension.decode(encoded)).to.throw(InvalidEncoding)
    })

    it('fails for first item not bytes', () => {
      const encoded = rlpEncode([[], Bytes.fromHex('1234')])
      expect(() => TrieExtension.decode(encoded)).to.throw(InvalidEncoding)
    })

    it('fails for second item not bytes', () => {
      const encoded = rlpEncode([Bytes.fromHex('1234'), []])
      expect(() => TrieExtension.decode(encoded)).to.throw(InvalidEncoding)
    })

    it('fails for first item invalid hex prefix', () => {
      const encoded = rlpEncode([Bytes.fromHex('0123'), Bytes.fromHex('1234')])
      expect(() => TrieExtension.decode(encoded)).to.throw(InvalidEncoding)
    })

    it('fails for first item invalid flag', () => {
      const encoded = rlpEncode([Bytes.fromHex('3210'), Bytes.fromHex('1234')])
      expect(() => TrieExtension.decode(encoded)).to.throw(InvalidEncoding)
    })

    it('fails for first item too short', () => {
      const encoded = rlpEncode([Bytes.fromHex('00'), Bytes.fromHex('1234')])
      expect(() => TrieExtension.decode(encoded)).to.throw(InvalidEncoding)
    })

    it('fails for second item too long', () => {
      const encoded = rlpEncode([
        Bytes.fromHex('00'),
        Bytes.fromHex('ff'.repeat(33)),
      ])
      expect(() => TrieExtension.decode(encoded)).to.throw(InvalidEncoding)
    })
  })
})
