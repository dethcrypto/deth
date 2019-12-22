import { expect } from 'chai'
import { TestProvider } from '../../src/TestProvider'
import { utils } from 'ethers'

describe('TestProvider.getTransactionCount', () => {
  it('can return a zero transaction count', async () => {
    const provider = new TestProvider()
    const wallet = provider.createEmptyWallet()

    const transactionCount = await provider.getTransactionCount(wallet.address)
    expect(transactionCount).to.equal(0)
  })

  it('can return a non-zero transaction count', async () => {
    const provider = new TestProvider()
    const [sender, recipient] = provider.getWallets()

    await sender.sendTransaction({
      to: recipient.address,
      value: utils.parseEther('3.1415'),
    })

    await sender.sendTransaction({
      to: recipient.address,
      value: utils.parseEther('3.1415'),
    })

    const transactionCount = await provider.getTransactionCount(sender.address)
    expect(transactionCount).to.equal(2)
  })

  xit('query pending')
  xit('query by blockTag')
})
