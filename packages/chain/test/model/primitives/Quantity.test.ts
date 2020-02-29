import { expect } from 'chai'
import BN from 'bn.js'
import {
  makeQuantity,
  bufferToQuantity,
  bnToQuantity,
  numberToQuantity,
} from '../../../src/model'

describe('makeQuantity', () => {
  it('accepts non-zero prefixed hex string and turns it into lowercase', () => {
    const data = '0x123AbcdEf'
    const expected = data.toLowerCase()

    expect(makeQuantity(data)).to.equal(expected)
  })

  it('accepts 0x', () => {
    expect(makeQuantity('0x')).to.equal('0x0')
  })

  it('accepts 0x0', () => {
    expect(makeQuantity('0x0')).to.equal('0x0')
  })

  it('throws for zero-prefixed hex strings', () => {
    expect(() => makeQuantity('0x0123')).to.throw(TypeError)
  })

  it('throws for non hex strings', () => {
    expect(() => makeQuantity('foo')).to.throw(TypeError)
  })
})

describe('bufferToQuantity', () => {
  it('turns buffer into Quantity', () => {
    const buffer = Buffer.from([0x10])
    expect(bufferToQuantity(buffer)).to.equal('0x10')
  })

  it('strips leading zeroes', () => {
    const buffer = Buffer.from([0x00, 0x10])
    expect(bufferToQuantity(buffer)).to.equal('0x10')
  })

  it('handles empty', () => {
    const buffer = Buffer.from([])
    expect(bufferToQuantity(buffer)).to.equal('0x0')
  })
})

describe('bnToQuantity', () => {
  it('turns BN into Quantity', () => {
    const bn = new BN(0x10)
    expect(bnToQuantity(bn)).to.equal('0x10')
  })

  it('handles zero', () => {
    const bn = new BN(0)
    expect(bnToQuantity(bn)).to.equal('0x0')
  })
})

describe('numberToQuantity', () => {
  it('turns number into Quantity', () => {
    expect(numberToQuantity(0x10)).to.equal('0x10')
  })

  it('handles zero', () => {
    expect(numberToQuantity(0)).to.equal('0x0')
  })
})
