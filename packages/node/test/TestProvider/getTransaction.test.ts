import { expect } from 'chai'
import { TestProvider } from '../../src/TestProvider'
import { utils } from 'ethers'

describe('getTransaction', () => {
  it('can return a mined transaction', async () => {
    const provider = new TestProvider()
    const [sender, recipient] = provider.getWallets()

    const value = utils.parseEther('3.1415')
    const response = await sender.sendTransaction({
      to: recipient.address,
      value,
    })

    const tx = await provider.getTransaction(response.hash!)
    const block = await provider.getBlock('latest')

    expect(utils.keccak256(tx.raw!)).to.equal(tx.hash)
    expect(tx).to.deep.equal({
      hash: response.hash,
      blockHash: block.hash,
      blockNumber: block.number,
      transactionIndex: 0,
      confirmations: 1,
      from: sender.address,
      gasPrice: response.gasPrice,
      gasLimit: response.gasLimit,
      to: recipient.address,
      value,
      nonce: 0,
      data: '0x',
      r: response.r,
      s: response.s,
      v: response.v,
      raw: tx.raw,
      creates: null,
      networkId: 2137,
      wait: tx.wait,
    })
  })

  xit('can return a contract creation')
  xit('can return an old transaction')
  xit('throws on nonexistent transaction')
})
