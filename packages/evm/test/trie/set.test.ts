import { expect } from 'chai'
import { Bytes } from '../../src/Bytes'
import { Trie } from '../../src/trie'

describe('Trie.set', () => {
  it('empty trie', () => {
    const trie = Trie.fromJson(undefined)
    trie.set(Bytes.fromHex('00'), Bytes.fromHex('abcd'))
    const expected = Trie.fromJson({
      type: 'Leaf',
      path: '00',
      value: 'abcd',
    })
    expect(trie).to.deep.equal(expected)
  })

  it('matching path leaf node', () => {
    const trie = Trie.fromJson({
      type: 'Leaf',
      path: '00',
      value: '1234',
    })
    trie.set(Bytes.fromHex('00'), Bytes.fromHex('abcd'))
    const expected = Trie.fromJson({
      type: 'Leaf',
      path: '00',
      value: 'abcd',
    })
    expect(trie).to.deep.equal(expected)
  })

  it('matching path branch no value', () => {
    const trie = Trie.fromJson({
      type: 'Branch',
      0: { type: 'Leaf', path: '0', value: '1234' },
      1: { type: 'Leaf', path: '1', value: 'abcd' },
    })
    trie.set(Bytes.fromHex(''), Bytes.fromHex('abcd'))
    const expected = Trie.fromJson({
      type: 'Branch',
      0: { type: 'Leaf', path: '0', value: '1234' },
      1: { type: 'Leaf', path: '1', value: 'abcd' },
      value: 'abcd',
    })
    expect(trie).to.deep.equal(expected)
  })

  it('matching path branch with value', () => {
    const trie = Trie.fromJson({
      type: 'Branch',
      0: { type: 'Leaf', path: '0', value: '1234' },
      value: '1234',
    })
    trie.set(Bytes.fromHex(''), Bytes.fromHex('abcd'))
    const expected = Trie.fromJson({
      type: 'Branch',
      0: { type: 'Leaf', path: '0', value: '1234' },
      value: 'abcd',
    })
    expect(trie).to.deep.equal(expected)
  })

  it('matching path long extension', () => {
    const trie = Trie.fromJson({
      type: 'Branch',
      0: { type: 'Leaf', path: '0', value: '1234' },
      1: {
        type: 'Branch',
        0: { type: 'Leaf', path: '0', value: '1234' },
        1: {
          type: 'Extension',
          path: '00',
          branch: {
            type: 'Branch',
            0: { type: 'Leaf', path: '0', value: '1234' },
            1: { type: 'Leaf', path: '1', value: 'abcd' },
          },
        },
      },
    })
    trie.set(Bytes.fromHex('11'), Bytes.fromHex('abcd'))
    const expected = Trie.fromJson({
      type: 'Branch',
      0: { type: 'Leaf', path: '0', value: '1234' },
      1: {
        type: 'Branch',
        0: { type: 'Leaf', path: '0', value: '1234' },
        1: {
          // new node
          type: 'Branch',
          value: 'abcd',
          0: {
            type: 'Extension',
            path: '0', // shortened
            branch: {
              type: 'Branch',
              0: { type: 'Leaf', path: '0', value: '1234' },
              1: { type: 'Leaf', path: '1', value: 'abcd' },
            },
          },
        },
      },
    })
    expect(trie).to.deep.equal(expected)
  })

  it('matching path short extension', () => {
    const trie = Trie.fromJson({
      type: 'Branch',
      0: { type: 'Leaf', path: '0', value: '1234' },
      1: {
        type: 'Branch',
        0: { type: 'Leaf', path: '0', value: '1234' },
        1: {
          type: 'Extension',
          path: '0',
          branch: {
            type: 'Branch',
            0: { type: 'Leaf', path: '0', value: '1234' },
            1: { type: 'Leaf', path: '1', value: 'abcd' },
          },
        },
      },
    })
    trie.set(Bytes.fromHex('11'), Bytes.fromHex('abcd'))
    const expected = Trie.fromJson({
      type: 'Branch',
      0: { type: 'Leaf', path: '0', value: '1234' },
      1: {
        type: 'Branch',
        0: { type: 'Leaf', path: '0', value: '1234' },
        1: {
          // new node
          type: 'Branch',
          value: 'abcd',
          0: {
            // replaced with child
            type: 'Branch',
            0: { type: 'Leaf', path: '0', value: '1234' },
            1: { type: 'Leaf', path: '1', value: 'abcd' },
          },
        },
      },
    })
    expect(trie).to.deep.equal(expected)
  })

  it('remaining path branch', () => {
    const trie = Trie.fromJson({
      type: 'Extension',
      path: '0',
      branch: {
        type: 'Branch',
        0: { type: 'Leaf', path: '0', value: '1234' },
        1: { type: 'Leaf', path: '1', value: 'abcd' },
      },
    })
    trie.set(Bytes.fromHex('02'), Bytes.fromHex('dead'))
    const expected = Trie.fromJson({
      type: 'Extension',
      path: '0',
      branch: {
        type: 'Branch',
        0: { type: 'Leaf', path: '0', value: '1234' },
        1: { type: 'Leaf', path: '1', value: 'abcd' },
        2: { type: 'Leaf', path: '', value: 'dead' },
      },
    })
    expect(trie).to.deep.equal(expected)
  })

  it('remaining path no common leaf short', () => {
    const trie = Trie.fromJson({
      type: 'Extension',
      path: '0',
      branch: {
        type: 'Branch',
        0: { type: 'Leaf', path: '0', value: '1234' },
        1: { type: 'Leaf', path: '', value: 'abcd' },
      },
    })
    trie.set(Bytes.fromHex('0123'), Bytes.fromHex('dead'))
    const expected = Trie.fromJson({
      type: 'Extension',
      path: '0',
      branch: {
        type: 'Branch',
        0: { type: 'Leaf', path: '0', value: '1234' },
        1: {
          type: 'Branch',
          value: 'abcd',
          2: { type: 'Leaf', path: '3', value: 'dead' },
        },
      },
    })
    expect(trie).to.deep.equal(expected)
  })

  it('remaining path no common leaf long', () => {
    const trie = Trie.fromJson({
      type: 'Extension',
      path: '0',
      branch: {
        type: 'Branch',
        0: { type: 'Leaf', path: '0', value: '1234' },
        1: { type: 'Leaf', path: '1234', value: 'abcd' },
      },
    })
    trie.set(Bytes.fromHex('0123'), Bytes.fromHex('dead'))
    const expected = Trie.fromJson({
      type: 'Extension',
      path: '0',
      branch: {
        type: 'Branch',
        0: { type: 'Leaf', path: '0', value: '1234' },
        1: {
          type: 'Branch',
          1: { type: 'Leaf', path: '234', value: 'abcd' },
          2: { type: 'Leaf', path: '3', value: 'dead' },
        },
      },
    })
    expect(trie).to.deep.equal(expected)
  })

  it('remaining path common leaf short', () => {
    const trie = Trie.fromJson({
      type: 'Extension',
      path: '0',
      branch: {
        type: 'Branch',
        0: { type: 'Leaf', path: '0', value: '1234' },
        1: { type: 'Leaf', path: '23', value: 'abcd' },
      },
    })
    trie.set(Bytes.fromHex('012345'), Bytes.fromHex('dead'))
    const expected = Trie.fromJson({
      type: 'Extension',
      path: '0',
      branch: {
        type: 'Branch',
        0: { type: 'Leaf', path: '0', value: '1234' },
        1: {
          type: 'Extension',
          path: '23',
          branch: {
            type: 'Branch',
            value: 'abcd',
            4: { type: 'Leaf', path: '5', value: 'dead' },
          },
        },
      },
    })
    expect(trie).to.deep.equal(expected)
  })

  it('remaining path common leaf long', () => {
    const trie = Trie.fromJson({
      type: 'Extension',
      path: '0',
      branch: {
        type: 'Branch',
        0: { type: 'Leaf', path: '0', value: '1234' },
        1: { type: 'Leaf', path: '23ab', value: 'abcd' },
      },
    })
    trie.set(Bytes.fromHex('012345'), Bytes.fromHex('dead'))
    const expected = Trie.fromJson({
      type: 'Extension',
      path: '0',
      branch: {
        type: 'Branch',
        0: { type: 'Leaf', path: '0', value: '1234' },
        1: {
          type: 'Extension',
          path: '23',
          branch: {
            type: 'Branch',
            a: { type: 'Leaf', path: 'b', value: 'abcd' },
            4: { type: 'Leaf', path: '5', value: 'dead' },
          },
        },
      },
    })
    expect(trie).to.deep.equal(expected)
  })

  it('remaining path common leaf longer', () => {
    const trie = Trie.fromJson({
      type: 'Leaf',
      path: '012345',
      value: '1234',
    })
    trie.set(Bytes.fromHex('0123'), Bytes.fromHex('dead'))
    const expected = Trie.fromJson({
      type: 'Extension',
      path: '0123',
      branch: {
        type: 'Branch',
        4: { type: 'Leaf', path: '5', value: '1234' },
        value: 'dead',
      },
    })
    expect(trie).to.deep.equal(expected)
  })

  it('remaining path no common extension short', () => {
    const trie = Trie.fromJson({
      type: 'Extension',
      path: '0',
      branch: {
        type: 'Branch',
        0: { type: 'Leaf', path: '0', value: '1234' },
        1: {
          type: 'Extension',
          path: '2',
          branch: {
            type: 'Branch',
            0: { type: 'Leaf', path: '0', value: '1234' },
            1: { type: 'Leaf', path: '1', value: 'abcd' },
          },
        },
      },
    })
    trie.set(Bytes.fromHex('01ab'), Bytes.fromHex('dead'))
    const expected = Trie.fromJson({
      type: 'Extension',
      path: '0',
      branch: {
        type: 'Branch',
        0: { type: 'Leaf', path: '0', value: '1234' },
        1: {
          type: 'Branch',
          a: { type: 'Leaf', path: 'b', value: 'dead' },
          2: {
            type: 'Branch',
            0: { type: 'Leaf', path: '0', value: '1234' },
            1: { type: 'Leaf', path: '1', value: 'abcd' },
          },
        },
      },
    })
    expect(trie).to.deep.equal(expected)
  })

  it('remaining path no common extension long', () => {
    const trie = Trie.fromJson({
      type: 'Extension',
      path: '0',
      branch: {
        type: 'Branch',
        0: { type: 'Leaf', path: '0', value: '1234' },
        1: {
          type: 'Extension',
          path: '234',
          branch: {
            type: 'Branch',
            0: { type: 'Leaf', path: '0', value: '1234' },
            1: { type: 'Leaf', path: '1', value: 'abcd' },
          },
        },
      },
    })
    trie.set(Bytes.fromHex('01ab'), Bytes.fromHex('dead'))
    const expected = Trie.fromJson({
      type: 'Extension',
      path: '0',
      branch: {
        type: 'Branch',
        0: { type: 'Leaf', path: '0', value: '1234' },
        1: {
          type: 'Branch',
          a: { type: 'Leaf', path: 'b', value: 'dead' },
          2: {
            type: 'Extension',
            path: '34',
            branch: {
              type: 'Branch',
              0: { type: 'Leaf', path: '0', value: '1234' },
              1: { type: 'Leaf', path: '1', value: 'abcd' },
            },
          },
        },
      },
    })
    expect(trie).to.deep.equal(expected)
  })

  it('remaining path common extension short', () => {
    const trie = Trie.fromJson({
      type: 'Extension',
      path: '0',
      branch: {
        type: 'Branch',
        0: { type: 'Leaf', path: '0', value: '1234' },
        1: {
          type: 'Extension',
          path: 'ac',
          branch: {
            type: 'Branch',
            0: { type: 'Leaf', path: '0', value: '1234' },
            1: { type: 'Leaf', path: '1', value: 'abcd' },
          },
        },
      },
    })
    trie.set(Bytes.fromHex('01ab'), Bytes.fromHex('dead'))
    const expected = Trie.fromJson({
      type: 'Extension',
      path: '0',
      branch: {
        type: 'Branch',
        0: { type: 'Leaf', path: '0', value: '1234' },
        1: {
          type: 'Extension',
          path: 'a',
          branch: {
            type: 'Branch',
            b: { type: 'Leaf', path: '', value: 'dead' },
            c: {
              type: 'Branch',
              0: { type: 'Leaf', path: '0', value: '1234' },
              1: { type: 'Leaf', path: '1', value: 'abcd' },
            },
          },
        },
      },
    })
    expect(trie).to.deep.equal(expected)
  })

  it('remaining path common extension long', () => {
    const trie = Trie.fromJson({
      type: 'Extension',
      path: '0',
      branch: {
        type: 'Branch',
        0: { type: 'Leaf', path: '0', value: '1234' },
        1: {
          type: 'Extension',
          path: 'acd',
          branch: {
            type: 'Branch',
            0: { type: 'Leaf', path: '0', value: '1234' },
            1: { type: 'Leaf', path: '1', value: 'abcd' },
          },
        },
      },
    })
    trie.set(Bytes.fromHex('01ab'), Bytes.fromHex('dead'))
    const expected = Trie.fromJson({
      type: 'Extension',
      path: '0',
      branch: {
        type: 'Branch',
        0: { type: 'Leaf', path: '0', value: '1234' },
        1: {
          type: 'Extension',
          path: 'a',
          branch: {
            type: 'Branch',
            b: { type: 'Leaf', path: '', value: 'dead' },
            c: {
              type: 'Extension',
              path: 'd',
              branch: {
                type: 'Branch',
                0: { type: 'Leaf', path: '0', value: '1234' },
                1: { type: 'Leaf', path: '1', value: 'abcd' },
              },
            },
          },
        },
      },
    })
    expect(trie).to.deep.equal(expected)
  })

  it('remaining path common extension longer', () => {
    const trie = Trie.fromJson({
      type: 'Extension',
      path: '012345',
      branch: {
        type: 'Branch',
        0: { type: 'Leaf', path: '0', value: '1234' },
        1: { type: 'Leaf', path: '1', value: 'abcd' },
      },
    })
    trie.set(Bytes.fromHex('0123'), Bytes.fromHex('dead'))
    const expected = Trie.fromJson({
      type: 'Extension',
      path: '0123',
      branch: {
        type: 'Branch',
        4: {
          type: 'Extension',
          path: '5',
          branch: {
            type: 'Branch',
            0: { type: 'Leaf', path: '0', value: '1234' },
            1: { type: 'Leaf', path: '1', value: 'abcd' },
          },
        },
        value: 'dead',
      },
    })
    expect(trie).to.deep.equal(expected)
  })

  it('no remaining path no match', () => {
    const trie = Trie.fromJson({
      type: 'Leaf',
      path: '012345',
      value: '1234',
    })
    trie.set(Bytes.fromHex(''), Bytes.fromHex('dead'))
    const expected = Trie.fromJson({
      type: 'Branch',
      0: { type: 'Leaf', path: '12345', value: '1234' },
      value: 'dead',
    })
    expect(trie).to.deep.equal(expected)
  })
})
