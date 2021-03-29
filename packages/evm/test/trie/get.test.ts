import { expect } from 'chai'
import { Bytes } from '../../src/Bytes'
import { Trie } from '../../src/trie'

describe('Trie.get', () => {
  it('empty trie', () => {
    const trie = Trie.EMPTY
    expect(trie.get(Bytes.fromHex(''))).to.deep.equal(Bytes.EMPTY)
  })

  it('has value', () => {
    const trie = Trie.EMPTY.set(Bytes.fromHex('0123'), Bytes.fromHex('abcd'))
    expect(trie.get(Bytes.fromHex('0123'))).to.deep.equal(Bytes.fromHex('abcd'))
  })

  it('does not have value', () => {
    const trie = Trie.EMPTY.set(Bytes.fromHex('0123'), Bytes.fromHex('abcd'))
    expect(trie.get(Bytes.fromHex('dead'))).to.deep.equal(Bytes.EMPTY)
  })
})
