import { expect } from 'chai'
import { makeHexData } from '../../../src/model'

describe('makeHexData', () => {
  it('accepts hex data and turns it into lowercase', () => {
    const data = '0x' + '1234AbCd'.repeat(50)
    const expected = data.toLowerCase()

    expect(makeHexData(data)).to.equal(expected)
  })

  it('throws for uneven length hex strings', () => {
    expect(() => makeHexData('0x123')).to.throw(TypeError)
  })

  it('throws for non hex strings', () => {
    expect(() => makeHexData('foo')).to.throw(TypeError)
  })
})
