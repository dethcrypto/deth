import { expect } from 'chai'
import { Bytes } from '../../src/Bytes'
import { InvalidEncoding } from '../../src/encoding'
import { rlpEncode } from '../../src/rlp'
import { TrieBranch } from '../../src/trie'

function to16Items(items: Record<number, string>) {
  const result = []
  for (let i = 0; i < 16; i++) {
    const entry = items[i] ?? ''
    result.push(Bytes.fromHex(entry))
  }
  return result
}

describe('TrieBranch', () => {
  const cases = [
    {
      name: 'one and value',
      node: new TrieBranch(to16Items({ 0: 'abc' }), Bytes.fromHex('def')),
      rlp: 'd5820abc808080808080808080808080808080820def',
    },
    {
      name: 'three and value',
      node: new TrieBranch(
        to16Items({ 0: 'abc', 1: '123', 10: 'ff' }),
        Bytes.fromHex('def')
      ),
      rlp: 'd8820abc820123808080808080808081ff8080808080820def',
    },
    {
      name: 'three no value',
      node: new TrieBranch(
        to16Items({ 0: 'abc', 1: '123', 10: 'ff' }),
        Bytes.EMPTY
      ),
      rlp: 'd6820abc820123808080808080808081ff808080808080',
    },
    {
      name: 'full',
      node: new TrieBranch(
        new Array(16).fill(Bytes.fromHex('ff'.repeat(32))),
        Bytes.fromHex('ff'.repeat(32))
      ),
      rlp:
        'f90231a0ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffa0ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffa0ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffa0ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffa0ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffa0ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffa0ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffa0ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffa0ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffa0ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffa0ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffa0ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffa0ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffa0ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffa0ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffa0ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffa0ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
    },
    {
      name: 'full no value',
      node: new TrieBranch(
        new Array(16).fill(Bytes.fromHex('ff'.repeat(32))),
        Bytes.EMPTY
      ),
      rlp:
        'f90211a0ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffa0ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffa0ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffa0ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffa0ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffa0ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffa0ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffa0ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffa0ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffa0ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffa0ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffa0ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffa0ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffa0ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffa0ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffa0ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff80',
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
        const decoded = TrieBranch.decode(Bytes.fromHex(rlp))
        expect(decoded).to.deep.equal(node)
      })
    }

    it('fails for not an array', () => {
      const encoded = rlpEncode(Bytes.fromHex('1234'))
      expect(() => TrieBranch.decode(encoded)).to.throw(InvalidEncoding)
    })

    it('fails for an array not of length 17', () => {
      const encoded = rlpEncode([Bytes.fromHex('1234')])
      expect(() => TrieBranch.decode(encoded)).to.throw(InvalidEncoding)
    })

    it('fails for some items not bytes', () => {
      const items = new Array(17).fill(Bytes.fromHex('123'))
      items[0] = []
      const encoded = rlpEncode(items)
      expect(() => TrieBranch.decode(encoded)).to.throw(InvalidEncoding)
    })

    it('fails for some children longer than 32', () => {
      const items = new Array(17).fill(Bytes.fromHex('123'))
      items[0] = Bytes.fromHex('ff'.repeat(33))
      const encoded = rlpEncode(items)
      expect(() => TrieBranch.decode(encoded)).to.throw(InvalidEncoding)
    })

    it('fails for too little non-empty', () => {
      const items = new Array(17).fill(Bytes.EMPTY)
      items[0] = Bytes.fromHex('ff')
      const encoded = rlpEncode(items)
      expect(() => TrieBranch.decode(encoded)).to.throw(InvalidEncoding)
    })
  })
})
