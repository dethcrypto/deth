import { expect } from 'chai'
import { Bytes } from '../src/Bytes'

describe('Bytes', () => {
  it('checks constructor arguments', () => {
    expect(() => Bytes.fromString('foo')).to.throw(TypeError)
  })

  it('can be constructed from a number', () => {
    const bytes = Bytes.fromNumber(0x00000000123)
    expect(bytes.toHex()).to.equal('0123')
  })

  it('when constructing from number zero is not treated as empty', () => {
    const bytes = Bytes.fromNumber(0)
    expect(bytes.length).to.equal(1)
  })

  it('can be constructed from byte int array', () => {
    const bytes = Bytes.fromByteIntArray([0, 1, 0, 2])
    expect(bytes).to.deep.equal(Bytes.fromString('00010002'))
  })

  it('can get a specific byte', () => {
    const bytes = Bytes.fromString('123456abcd')
    expect(bytes.getByte(0)).to.equal('12')
    expect(bytes.getByte(1)).to.equal('34')
    expect(bytes.getByte(4)).to.equal('cd')
  })

  it('can get a specific byte as int', () => {
    const bytes = Bytes.fromString('123456abcd')
    expect(bytes.getByteInt(0)).to.equal(0x12)
    expect(bytes.getByteInt(1)).to.equal(0x34)
    expect(bytes.getByteInt(4)).to.equal(0xcd)
  })

  it('can get length', () => {
    const bytes = Bytes.fromString('123456abcd')
    expect(bytes.length).to.equal(5)
  })

  it('can slice the content', () => {
    const bytes = Bytes.fromString('123456abcd')
    expect(bytes.slice(1, 3)).to.deep.equal(Bytes.fromString('3456'))
  })

  it('can concat', () => {
    const first = Bytes.fromString('1234')
    const second = Bytes.fromString('5678')
    expect(first.concat(second)).to.deep.equal(Bytes.fromString('12345678'))
  })

  it('can convert to string', () => {
    const bytes = Bytes.fromString('123456abcd')
    expect(bytes.toHex()).to.equal('123456abcd')
  })

  it('ignores casing', () => {
    const bytes = Bytes.fromString('AB12cd')
    expect(bytes.toHex()).to.equal('ab12cd')
  })

  it('can compare equality', () => {
    const first = Bytes.fromString('56ab')
    const second = Bytes.fromString('56AB')
    const third = Bytes.fromString('1234')
    expect(first.equals(second)).to.equal(true)
    expect(second.equals(first)).to.equal(true)
    expect(first.equals(third)).to.equal(false)
    expect(third.equals(first)).to.equal(false)
    expect(second.equals(third)).to.equal(false)
    expect(third.equals(second)).to.equal(false)
  })

  it('can be converted to byte int array', () => {
    const array = Bytes.fromString('1234ab').toByteIntArray()
    expect(array).to.deep.equal([0x12, 0x34, 0xab])
  })
})
