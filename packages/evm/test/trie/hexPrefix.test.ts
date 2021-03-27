import { expect } from 'chai'
import { Bytes } from '../../src/Bytes'
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

function toNibbles(hex: string) {
  return hex.split('').map((x) => parseInt(x, 16))
}

describe('hexPrefixEncode', () => {
  for (const { nibbles, flag, hexPrefix } of testCases) {
    it(`HP("${nibbles}", ${flag}) = "${hexPrefix}"`, () => {
      const encoded = hexPrefixEncode(toNibbles(nibbles), flag)
      expect(encoded).to.deep.equal(Bytes.fromHex(hexPrefix))
    })
  }
})

describe('hexPrefixDecode', () => {
  for (const { nibbles, flag, hexPrefix } of testCases) {
    it(`HP("${nibbles}", ${flag}) = "${hexPrefix}"`, () => {
      const output = hexPrefixDecode(Bytes.fromHex(hexPrefix))
      expect(output[0]).to.deep.equal(toNibbles(nibbles))
      expect(output[1]).to.equal(flag)
    })
  }
})
