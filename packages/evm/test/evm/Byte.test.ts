import { expect } from 'chai'
import { Byte } from '../../src/evm/Byte'

describe('Byte', () => {
  describe('fromNumber', () => {
    it('fails for non-integers', () => {
      expect(() => Byte.fromNumber(0.2)).to.throw(TypeError)
      expect(() => Byte.fromNumber(NaN)).to.throw(TypeError)
      expect(() => Byte.fromNumber(Infinity)).to.throw(TypeError)
    })

    it('fails for integers outside of range', () => {
      expect(() => Byte.fromNumber(-1)).to.throw(TypeError)
      expect(() => Byte.fromNumber(256)).to.throw(TypeError)
      expect(() => Byte.fromNumber(1000)).to.throw(TypeError)
    })

    it('works for bytes', () => {
      expect(Byte.fromNumber(0)).to.equal(0)
      expect(Byte.fromNumber(1)).to.equal(1)
      expect(Byte.fromNumber(255)).to.equal(255)
    })
  })

  describe('fromHexString', () => {
    it('fails for non-hex strings', () => {
      expect(() => Byte.fromHexString('goo')).to.throw(TypeError)
      expect(() => Byte.fromHexString('i like dogs')).to.throw(TypeError)
    })

    it('fails for hex stings of not 2 digit', () => {
      expect(() => Byte.fromHexString('')).to.throw(TypeError)
      expect(() => Byte.fromHexString('f')).to.throw(TypeError)
      expect(() => Byte.fromHexString('eff')).to.throw(TypeError)
      expect(() => Byte.fromHexString('eff0')).to.throw(TypeError)
    })

    it('works for bytes', () => {
      expect(Byte.fromHexString('00')).to.equal(0)
      expect(Byte.fromHexString('01')).to.equal(1)
      expect(Byte.fromHexString('fF')).to.equal(255)
    })
  })
})
