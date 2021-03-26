import { expect } from 'chai'
import { utils } from 'ethers'
import { createTestProvider } from './TestProvider'

describe('TestProvider.getTransactionCount', () => {
  it('can return a zero transaction count', async () => {
    const provider = await createTestProvider()
    const wallet = provider.createEmptyWallet()

    const transactionCount = await provider.getTransactionCount(wallet.address)
    expect(transactionCount).to.equal(0)
  })

  it('can return a non-zero transaction count', async () => {
    const provider = await createTestProvider()
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

  it('throws for blockTag !== latest or pending', async () => {
    const provider = await createTestProvider()
    const wallet = provider.createEmptyWallet()

    await expect(
      provider.getTransactionCount(wallet.address, '0x1')
    ).to.be.rejectedWith('Unsupported blockTag')
  })
})
