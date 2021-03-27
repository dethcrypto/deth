import BN from 'bn.js'
import { expect } from 'chai'
import { Bytes } from '../../src/Bytes'
import { InvalidEncoding } from '../../src/encoding'
import { rlpDecode, rlpEncode, RlpSerializable } from '../../src/rlp'
import testCasesEthInvalid from './eth-invalid.json'
import testCasesEthValid from './eth-valid.json'
import testCasesEthers from './ethers.json'

describe('rlpEncode', () => {
  describe('ethers', () => {
    for (const testCase of testCasesEthers) {
      it(testCase.name, () => {
        const result = rlpEncode(fromEthers(testCase.decoded))
        expect(result).to.deep.equal(Bytes.fromHex(testCase.encoded))
      })
    }
  })

  describe('eth valid', () => {
    for (const [name, testCase] of Object.entries(testCasesEthValid)) {
      it(name, () => {
        const result = rlpEncode(fromEth(testCase.in))
        expect(result).to.deep.equal(Bytes.fromHex(testCase.out))
      })
    }
  })
})

describe('rlpDecode', () => {
  describe('ethers', () => {
    for (const testCase of testCasesEthers) {
      it(testCase.name, () => {
        const result = rlpDecode(Bytes.fromHex(testCase.encoded))
        expect(result).to.deep.equal(fromEthers(testCase.decoded))
      })
    }
  })

  describe('eth valid', () => {
    for (const [name, testCase] of Object.entries(testCasesEthValid)) {
      it(name, () => {
        const result = rlpDecode(Bytes.fromHex(testCase.out))
        expect(result).to.deep.equal(fromEth(testCase.in))
      })
    }
  })

  describe('eth invalid', () => {
    for (const [name, testCase] of Object.entries(testCasesEthInvalid)) {
      it(name, () => {
        expect(() => rlpDecode(Bytes.fromHex(testCase.out))).to.throw(
          InvalidEncoding
        )
      })
    }
  })
})

type EthInput = string | number | EthInput[]
function fromEth(input: EthInput): RlpSerializable {
  if (typeof input === 'number') {
    return Bytes.fromNumber(input)
  } else if (typeof input === 'string') {
    if (input.startsWith('#')) {
      const hex = new BN(input.substring(1), 10).toString(16)
      return Bytes.fromHex(hex)
    } else {
      return Bytes.fromByteArray(input.split('').map((x) => x.charCodeAt(0)))
    }
  } else {
    return input.map(fromEth)
  }
}

type EthersInput = string | EthersInput[]
function fromEthers(value: EthersInput): RlpSerializable {
  if (Array.isArray(value)) {
    return value.map(fromEthers)
  } else {
    return Bytes.fromHex(value)
  }
}
