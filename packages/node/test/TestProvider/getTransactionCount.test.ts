import { expect } from 'chai'
import { TestProvider } from '../../src/TestProvider'
import { utils } from 'ethers'

describe('TestProvider.getTransactionCount', () => {
  it('can return a zero transaction count', async () => {
    const provider = new TestProvider()
    const wallet = provider.walletManager.createEmptyWallet()

    const transactionCount = await provider.getTransactionCount(wallet.address)
    expect(transactionCount).to.equal(0)
  })

  it('can return a non-zero transaction count', async () => {
    const provider = new TestProvider()
    const [sender, recipient] = provider.walletManager.getWallets()

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

  it('throws for blockTag !== latest or pending', async () => {
    const provider = new TestProvider()
    const wallet = provider.walletManager.createEmptyWallet()

    await expect(
      provider.getTransactionCount(wallet.address, '0x1'),
    ).to.be.rejectedWith('Unsupported blockTag')
  })
})
