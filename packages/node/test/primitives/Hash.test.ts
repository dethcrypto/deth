import { expect } from 'chai'
import { makeHash } from '../../src/primitives'

describe('makeHash', () => {
  it('accepts hashes and turns them to lowercase', () => {
    const hash = '0x' + '1234AbCd'.repeat(8)
    const expected = hash.toLowerCase()

    expect(makeHash(hash)).to.equal(expected)
  })

  it('throws for non hash hex strings', () => {
    expect(() => makeHash('0x1234')).to.throw(TypeError)
  })

  it('throws for non hex strings', () => {
    expect(() => makeHash('foo')).to.throw(TypeError)
  })
})
