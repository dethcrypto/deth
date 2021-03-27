import { expect } from 'chai'
import { Bytes } from '../../src/Bytes'
import { InvalidEncoding } from '../../src/encoding'
import { hexPrefixEncode, hexPrefixDecode } from '../../src/trie'

const testCases = [
  {
    nibbles: '',
    flag: false,
    hexPrefix: '00',
  },
  {
    nibbles: '',
    flag: true,
    hexPrefix: '20',
  },
  {
    nibbles: 'a',
    flag: false,
    hexPrefix: '1a',
  },
  {
    nibbles: 'a',
    flag: true,
    hexPrefix: '3a',
  },
  {
    nibbles: 'ab',
    flag: false,
    hexPrefix: '00ab',
  },
  {
    nibbles: 'ab',
    flag: true,
    hexPrefix: '20ab',
  },
]

describe('hexPrefixEncode', () => {
  for (const { nibbles, flag, hexPrefix } of testCases) {
    it(`HP("${nibbles}", ${flag}) = "${hexPrefix}"`, () => {
      const encoded = hexPrefixEncode(nibbles, flag)
      expect(encoded).to.deep.equal(Bytes.fromHex(hexPrefix))
    })
  }
})

describe('hexPrefixDecode', () => {
  for (const { nibbles, flag, hexPrefix } of testCases) {
    it(`HP("${nibbles}", ${flag}) = "${hexPrefix}"`, () => {
      const output = hexPrefixDecode(Bytes.fromHex(hexPrefix))
      expect(output[0]).to.deep.equal(nibbles)
      expect(output[1]).to.equal(flag)
    })
  }

  const invalid = ['', '0a', '0a34', '2a', '2a34', '50', '51', '5134']

  for (const sequence of invalid) {
    it(`fails for "${sequence}"`, () => {
      expect(() => hexPrefixDecode(Bytes.fromHex(sequence))).to.throw(
        InvalidEncoding
      )
    })
  }
})
