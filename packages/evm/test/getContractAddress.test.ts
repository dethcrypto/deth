import { expect } from 'chai'
import { getContractAddress } from '../src/getContractAddress'
import { Address } from '../src/Address'

describe('getContractAddress', () => {
  const testCases = [
    {
      sender: 'ca35b7d915458ef540ade6068dfe2f44e8fa733c',
      nonce: 0,
      contract: '692a70d2e424a56d2c6c27aa97d1a86395877b3a',
    },
    {
      sender: 'ca35b7d915458ef540ade6068dfe2f44e8fa733c',
      nonce: 1,
      contract: 'bbf289d846208c16edc8474705c748aff07732db',
    },
    {
      sender: '14723a09acff6d2a60dcdf7aa4aff308fddc160c',
      nonce: 0,
      contract: '0fdf4894a3b7c5a101686829063be52ad45bcfb7',
    },
  ]
  for (const testCase of testCases) {
    it(`works for ${testCase.sender} and nonce ${testCase.nonce}`, () => {
      const contract = getContractAddress(
        testCase.sender as Address,
        testCase.nonce
      )
      expect(contract).to.equal(testCase.contract)
    })
  }
})
