import { expect } from 'chai'
import { Bytes } from '../../src/Bytes'
import { Trie } from '../../src/trie'

describe('Trie.remove', () => {
  it('branch with 2+ children', () => {
    const trie = Trie.fromJson({
      // to remove
      type: 'Branch',
      0: { type: 'Leaf', path: '0', value: '1234' },
      1: { type: 'Leaf', path: '1', value: 'abcd' },
      value: '1a2b',
    })
    trie.remove(Bytes.fromHex(''))
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
    trie.remove(Bytes.fromHex(''))
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
    trie.remove(Bytes.fromHex('00'))
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
    trie.remove(Bytes.fromHex('00'))
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
    trie.remove(Bytes.fromHex('00'))
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
