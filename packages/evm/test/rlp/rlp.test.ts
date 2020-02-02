import { expect } from 'chai'
import testCasesJSON from './testCases.json'
import { Byte } from '../../src/Byte'
import { Tuple, rlpEncode, rlpDecode } from '../../src/rlp'

const testCases = testCasesJSON.map(test => ({
  name: test.name,
  decoded: mapDecoded(test.decoded),
  encoded: mapHex(test.encoded),
}))

type Decoded = (string | Decoded)[] | string

function mapDecoded (value: Decoded): Tuple | Byte[] {
  if (Array.isArray(value)) {
    return new Tuple(value.map(mapDecoded))
  } else {
    return mapHex(value)
  }
}

function mapHex (value: string) {
  const noPrefix = value.substring(2)
  if (!noPrefix) {
    return []
  }
  return noPrefix.match(/../g)!.map(x => parseInt(x, 16) as Byte)
}

describe('rlpEncode', () => {
  for (const testCase of testCases) {
    it(testCase.name, () => {
      const result = rlpEncode(testCase.decoded)
      expect(result).to.deep.equal(testCase.encoded)
    })
  }
})

describe.skip('rlpDecode', () => {
  for (const testCase of testCases) {
    it(testCase.name, () => {
      const result = rlpDecode(testCase.encoded)
      expect(result).to.deep.equal(testCase.decoded)
    })
  }
})
