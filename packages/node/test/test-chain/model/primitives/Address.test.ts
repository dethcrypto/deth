import { expect } from 'chai'
import { makeAddress, bufferToMaybeAddress } from '../../../../src/test-chain/model'

describe('makeAddress', () => {
  it('accepts addresses and turns them to lowercase', () => {
    const address = '0x' + '1234AbCd'.repeat(5)
    const expected = address.toLowerCase()

    expect(makeAddress(address)).to.equal(expected)
  })

  it('throws for non address hex strings', () => {
    expect(() => makeAddress('0x1234')).to.throw(TypeError)
  })

  it('throws for non hex strings', () => {
    expect(() => makeAddress('foo')).to.throw(TypeError)
  })
})

describe('bufferToMaybeAddress', () => {
  it('turns a buffer into an address', () => {
    const buffer = Buffer.from([
      0x12, 0x34, 0xAB, 0xCD,
      0x12, 0x34, 0xAB, 0xCD,
      0x12, 0x34, 0xAB, 0xCD,
      0x12, 0x34, 0xAB, 0xCD,
      0x12, 0x34, 0xAB, 0xCD,
    ])
    const expected = '0x' + '1234abcd'.repeat(5)

    expect(bufferToMaybeAddress(buffer)).to.equal(expected)
  })

  it('returns undefined for an empty buffer', () => {
    const buffer = Buffer.from([])
    expect(bufferToMaybeAddress(buffer)).to.equal(undefined)
  })

  it('returns undefined for undefined', () => {
    expect(bufferToMaybeAddress(undefined)).to.equal(undefined)
  })

  it('throws for invalid buffer', () => {
    const buffer = Buffer.from([0x69])
    expect(() => bufferToMaybeAddress(buffer)).to.throw(TypeError)
  })
})
