import { expect } from 'chai'
import { Bytes } from '../src/Bytes'

function b (value: string) {
  return Bytes.fromString(value)
}

describe('Bytes', () => {
  it('checks constructor arguments', () => {
    expect(() => b('foo')).to.throw(TypeError)
  })

  it('can get a specific byte', () => {
    const bytes = b('123456abcd')
    expect(bytes.getByte(0)).to.equal('12')
    expect(bytes.getByte(1)).to.equal('34')
    expect(bytes.getByte(4)).to.equal('cd')
  })

  it('can get a specific byte as int', () => {
    const bytes = b('123456abcd')
    expect(bytes.getByteInt(0)).to.equal(0x12)
    expect(bytes.getByteInt(1)).to.equal(0x34)
    expect(bytes.getByteInt(4)).to.equal(0xcd)
  })

  it('can get length', () => {
    const bytes = b('123456abcd')
    expect(bytes.getLength()).to.equal(5)
  })

  it('can slice the content', () => {
    const bytes = b('123456abcd')
    expect(bytes.slice(1, 3)).to.deep.equal(b('3456'))
  })

  it('can concat', () => {
    const first = b('1234')
    const second = b('5678')
    expect(first.concat(second)).to.deep.equal(b('12345678'))
  })

  it('can convert to string', () => {
    const bytes = b('123456abcd')
    expect(bytes.toHex()).to.equal('123456abcd')
  })

  it('ignores casing', () => {
    const bytes = b('AB12cd')
    expect(bytes.toHex()).to.equal('ab12cd')
  })

  it('can compare equality', () => {
    const first = b('56ab')
    const second = b('56AB')
    const third = b('1234')
    expect(first.equals(second)).to.equal(true)
    expect(second.equals(first)).to.equal(true)
    expect(first.equals(third)).to.equal(false)
    expect(third.equals(first)).to.equal(false)
    expect(second.equals(third)).to.equal(false)
    expect(third.equals(second)).to.equal(false)
  })
})
