import { expect } from 'chai'
import { Bytes } from '../../src/Bytes'
import { Trie } from '../../src/trie'

describe('Trie.remove', () => {
  it('branch with 2+ children', () => {
    let trie = Trie.fromJson({
      // to remove
      type: 'Branch',
      0: { type: 'Leaf', path: '0', value: '1234' },
      1: { type: 'Leaf', path: '1', value: 'abcd' },
      value: '1a2b',
    })
    trie = trie.remove(Bytes.fromHex(''))
    const expected = Trie.fromJson({
      // value removed
      type: 'Branch',
      0: { type: 'Leaf', path: '0', value: '1234' },
      1: { type: 'Leaf', path: '1', value: 'abcd' },
    })
    expect(trie).to.deep.equal(expected)
  })

  it('branch with 1 child and no parent', () => {
    let trie = Trie.fromJson({
      // to remove
      type: 'Branch',
      0: { type: 'Leaf', path: '0', value: '1234' },
      value: '1a2b',
    })
    trie = trie.remove(Bytes.fromHex(''))
    const expected = Trie.fromJson({
      // replaced with leaf
      type: 'Leaf',
      path: '00',
      value: '1234',
    })
    expect(trie).to.deep.equal(expected)
  })

  it('branch with 1 branch child and branch parent', () => {
    let trie = Trie.fromJson({
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
    trie = trie.remove(Bytes.fromHex('00'))
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
    let trie = Trie.fromJson({
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
    trie = trie.remove(Bytes.fromHex('00'))
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
    let trie = Trie.fromJson({
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
    trie = trie.remove(Bytes.fromHex('00'))
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

  it('branch with 1 branch child and extension parent', () => {
    let trie = Trie.fromJson({
      type: 'Extension',
      path: '00',
      branch: {
        // to remove
        type: 'Branch',
        0: {
          type: 'Branch',
          0: { type: 'Leaf', path: '', value: '1234' },
          1: { type: 'Leaf', path: '', value: 'abcd' },
        },
        value: 'dead',
      },
    })
    trie = trie.remove(Bytes.fromHex('00'))
    const expected = Trie.fromJson({
      // extended
      type: 'Extension',
      path: '000',
      branch: {
        type: 'Branch',
        0: { type: 'Leaf', path: '', value: '1234' },
        1: { type: 'Leaf', path: '', value: 'abcd' },
      },
    })
    expect(trie).to.deep.equal(expected)
  })

  it('branch with 1 extension child and extension parent', () => {
    let trie = Trie.fromJson({
      type: 'Extension',
      path: '00',
      branch: {
        // to remove
        type: 'Branch',
        0: {
          type: 'Extension',
          path: '00',
          branch: {
            type: 'Branch',
            0: { type: 'Leaf', path: '', value: '1234' },
            1: { type: 'Leaf', path: '', value: 'abcd' },
          },
        },
        value: 'dead',
      },
    })
    trie = trie.remove(Bytes.fromHex('00'))
    const expected = Trie.fromJson({
      // extended
      type: 'Extension',
      path: '00000',
      branch: {
        type: 'Branch',
        0: { type: 'Leaf', path: '', value: '1234' },
        1: { type: 'Leaf', path: '', value: 'abcd' },
      },
    })
    expect(trie).to.deep.equal(expected)
  })

  it('branch with 1 leaf child and extension parent', () => {
    let trie = Trie.fromJson({
      type: 'Extension',
      path: '00',
      branch: {
        // to remove
        type: 'Branch',
        0: { type: 'Leaf', path: '0', value: '1234' },
        value: 'dead',
      },
    })
    trie = trie.remove(Bytes.fromHex('00'))
    const expected = Trie.fromJson({
      // extended
      type: 'Leaf',
      path: '0000',
      value: '1234',
    })
    expect(trie).to.deep.equal(expected)
  })

  it('leaf with no parent', () => {
    let trie = Trie.fromJson({
      type: 'Leaf',
      path: '00',
      value: '1234',
    })
    trie = trie.remove(Bytes.fromHex('00'))
    const expected = Trie.fromJson(undefined)
    expect(trie).to.deep.equal(expected)
  })

  it('leaf with 2+ siblings', () => {
    let trie = Trie.fromJson({
      type: 'Branch',
      0: { type: 'Leaf', path: '0', value: '1234' },
      1: { type: 'Leaf', path: '1', value: 'abcd' },
      2: { type: 'Leaf', path: '2', value: 'dead' },
    })
    trie = trie.remove(Bytes.fromHex('00'))
    const expected = Trie.fromJson({
      type: 'Branch',
      1: { type: 'Leaf', path: '1', value: 'abcd' },
      2: { type: 'Leaf', path: '2', value: 'dead' },
    })
    expect(trie).to.deep.equal(expected)
  })

  it('leaf with 1 sibling and value parent', () => {
    let trie = Trie.fromJson({
      type: 'Branch',
      0: { type: 'Leaf', path: '0', value: '1234' },
      1: { type: 'Leaf', path: '1', value: 'abcd' },
      value: 'dead',
    })
    trie = trie.remove(Bytes.fromHex('00'))
    const expected = Trie.fromJson({
      type: 'Branch',
      1: { type: 'Leaf', path: '1', value: 'abcd' },
      value: 'dead',
    })
    expect(trie).to.deep.equal(expected)
  })

  it('leaf with no siblings no grandparent', () => {
    let trie = Trie.fromJson({
      type: 'Branch',
      0: { type: 'Leaf', path: '0', value: '1234' },
      value: 'dead',
    })
    trie = trie.remove(Bytes.fromHex('00'))
    const expected = Trie.fromJson({
      type: 'Leaf',
      path: '',
      value: 'dead',
    })
    expect(trie).to.deep.equal(expected)
  })

  it('leaf with no siblings branch grandparent', () => {
    let trie = Trie.fromJson({
      type: 'Extension',
      path: '0',
      branch: {
        type: 'Branch',
        0: {
          type: 'Branch',
          0: { type: 'Leaf', path: '0', value: '1234' },
          value: 'dead',
        },
        1: { type: 'Leaf', path: '1', value: 'abcd' },
      },
    })
    trie = trie.remove(Bytes.fromHex('0000'))
    const expected = Trie.fromJson({
      type: 'Extension',
      path: '0',
      branch: {
        type: 'Branch',
        0: { type: 'Leaf', path: '', value: 'dead' },
        1: { type: 'Leaf', path: '1', value: 'abcd' },
      },
    })
    expect(trie).to.deep.equal(expected)
  })

  it('leaf with no siblings extension grandparent', () => {
    let trie = Trie.fromJson({
      type: 'Extension',
      path: '00',
      branch: {
        type: 'Branch',
        0: { type: 'Leaf', path: '0', value: '1234' },
        value: 'dead',
      },
    })
    trie = trie.remove(Bytes.fromHex('0000'))
    const expected = Trie.fromJson({
      type: 'Leaf',
      path: '00',
      value: 'dead',
    })
    expect(trie).to.deep.equal(expected)
  })

  it('leaf with leaf sibling no grandparent', () => {
    let trie = Trie.fromJson({
      type: 'Branch',
      0: { type: 'Leaf', path: '0', value: '1234' },
      1: { type: 'Leaf', path: '1', value: 'abcd' },
    })
    trie = trie.remove(Bytes.fromHex('00'))
    const expected = Trie.fromJson({
      type: 'Leaf',
      path: '11',
      value: 'abcd',
    })
    expect(trie).to.deep.equal(expected)
  })

  it('leaf with leaf sibling branch grandparent', () => {
    let trie = Trie.fromJson({
      type: 'Branch',
      0: {
        type: 'Branch',
        0: { type: 'Leaf', path: '00', value: '1234' },
        1: { type: 'Leaf', path: '10', value: 'abcd' },
      },
      1: { type: 'Leaf', path: '1', value: 'dead' },
    })
    trie = trie.remove(Bytes.fromHex('0000'))
    const expected = Trie.fromJson({
      type: 'Branch',
      0: { type: 'Leaf', path: '110', value: 'abcd' },
      1: { type: 'Leaf', path: '1', value: 'dead' },
    })
    expect(trie).to.deep.equal(expected)
  })

  it('leaf with leaf sibling extension grandparent', () => {
    let trie = Trie.fromJson({
      type: 'Extension',
      path: '00',
      branch: {
        type: 'Branch',
        0: { type: 'Leaf', path: '0', value: '1234' },
        1: { type: 'Leaf', path: '1', value: 'abcd' },
      },
    })
    trie = trie.remove(Bytes.fromHex('0000'))
    const expected = Trie.fromJson({
      type: 'Leaf',
      path: '0011',
      value: 'abcd',
    })
    expect(trie).to.deep.equal(expected)
  })

  it('leaf with extension sibling no grandparent', () => {
    let trie = Trie.fromJson({
      type: 'Branch',
      0: { type: 'Leaf', path: '0', value: '1234' },
      1: {
        type: 'Extension',
        path: '1',
        branch: {
          type: 'Branch',
          0: { type: 'Leaf', path: '0', value: 'dead' },
          1: { type: 'Leaf', path: '1', value: 'abcd' },
        },
      },
    })
    trie = trie.remove(Bytes.fromHex('00'))
    const expected = Trie.fromJson({
      type: 'Extension',
      path: '11',
      branch: {
        type: 'Branch',
        0: { type: 'Leaf', path: '0', value: 'dead' },
        1: { type: 'Leaf', path: '1', value: 'abcd' },
      },
    })
    expect(trie).to.deep.equal(expected)
  })

  it('leaf with extension sibling branch grandparent', () => {
    let trie = Trie.fromJson({
      type: 'Branch',
      0: {
        type: 'Branch',
        0: { type: 'Leaf', path: '', value: '1234' },
        1: {
          type: 'Extension',
          path: '1',
          branch: {
            type: 'Branch',
            0: { type: 'Leaf', path: '', value: 'dead' },
            1: { type: 'Leaf', path: '', value: 'abcd' },
          },
        },
      },
      value: 'b00b',
    })
    trie = trie.remove(Bytes.fromHex('00'))
    const expected = Trie.fromJson({
      type: 'Branch',
      0: {
        type: 'Extension',
        path: '11',
        branch: {
          type: 'Branch',
          0: { type: 'Leaf', path: '', value: 'dead' },
          1: { type: 'Leaf', path: '', value: 'abcd' },
        },
      },
      value: 'b00b',
    })
    expect(trie).to.deep.equal(expected)
  })

  it('leaf with extension sibling extension grandparent', () => {
    let trie = Trie.fromJson({
      type: 'Extension',
      path: '00',
      branch: {
        type: 'Branch',
        0: { type: 'Leaf', path: '0', value: '1234' },
        1: {
          type: 'Extension',
          path: '1',
          branch: {
            type: 'Branch',
            0: { type: 'Leaf', path: '0', value: 'dead' },
            1: { type: 'Leaf', path: '1', value: 'abcd' },
          },
        },
      },
    })
    trie = trie.remove(Bytes.fromHex('0000'))
    const expected = Trie.fromJson({
      type: 'Extension',
      path: '0011',
      branch: {
        type: 'Branch',
        0: { type: 'Leaf', path: '0', value: 'dead' },
        1: { type: 'Leaf', path: '1', value: 'abcd' },
      },
    })
    expect(trie).to.deep.equal(expected)
  })

  it('leaf with branch sibling no grandparent', () => {
    let trie = Trie.fromJson({
      type: 'Branch',
      0: { type: 'Leaf', path: '0', value: '1234' },
      1: {
        type: 'Branch',
        0: { type: 'Leaf', path: '', value: 'bead' },
        1: { type: 'Leaf', path: '', value: 'f00d' },
      },
    })
    trie = trie.remove(Bytes.fromHex('00'))
    const expected = Trie.fromJson({
      type: 'Extension',
      path: '1',
      branch: {
        type: 'Branch',
        0: { type: 'Leaf', path: '', value: 'bead' },
        1: { type: 'Leaf', path: '', value: 'f00d' },
      },
    })
    expect(trie).to.deep.equal(expected)
  })

  it('leaf with branch sibling branch grandparent', () => {
    let trie = Trie.fromJson({
      type: 'Branch',
      0: {
        type: 'Branch',
        0: { type: 'Leaf', path: '', value: '1234' },
        1: {
          type: 'Branch',
          0: { type: 'Leaf', path: '1', value: 'bead' },
          1: { type: 'Leaf', path: '0', value: 'f00d' },
        },
      },
      1: { type: 'Leaf', path: '0', value: 'dead' },
    })
    trie = trie.remove(Bytes.fromHex('00'))
    const expected = Trie.fromJson({
      type: 'Branch',
      0: {
        type: 'Extension',
        path: '1',
        branch: {
          type: 'Branch',
          0: { type: 'Leaf', path: '1', value: 'bead' },
          1: { type: 'Leaf', path: '0', value: 'f00d' },
        },
      },
      1: { type: 'Leaf', path: '0', value: 'dead' },
    })
    expect(trie).to.deep.equal(expected)
  })

  it('leaf with branch sibling extension grandparent', () => {
    let trie = Trie.fromJson({
      type: 'Extension',
      path: '00',
      branch: {
        type: 'Branch',
        0: { type: 'Leaf', path: '0', value: '1234' },
        1: {
          type: 'Branch',
          0: { type: 'Leaf', path: '', value: 'dead' },
          1: { type: 'Leaf', path: '', value: 'abcd' },
        },
      },
    })
    trie = trie.remove(Bytes.fromHex('0000'))
    const expected = Trie.fromJson({
      type: 'Extension',
      path: '001',
      branch: {
        type: 'Branch',
        0: { type: 'Leaf', path: '', value: 'dead' },
        1: { type: 'Leaf', path: '', value: 'abcd' },
      },
    })
    expect(trie).to.deep.equal(expected)
  })
})
