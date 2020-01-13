import { expect } from 'chai'
import { utils } from 'ethers'
import { createTestProvider } from '../testutils'

describe('TestProvider.getBlock', () => {
  it('can return a zero balance', async () => {
    const provider = await createTestProvider()
    const wallet = provider.walletManager.createEmptyWallet()

    const balance = await provider.getBalance(wallet.address)
    expect(balance.eq(0)).to.equal(true)
  })

  it('can return a non-zero balance', async () => {
    const provider = await createTestProvider()
    const [sender] = provider.walletManager.getWallets()
    const recipient = provider.walletManager.createEmptyWallet()

    const value = utils.parseEther('3.1415')
    await sender.sendTransaction({
      to: recipient.address,
      value,
    })

    const balance = await provider.getBalance(recipient.address)
    expect(balance.eq(value)).to.equal(true)
  })

  it('can return a balance turned zero', async () => {
    const provider = await createTestProvider()
    const [sender] = provider.walletManager.getWallets()
    const recipient = provider.walletManager.createEmptyWallet()

    const value = utils.parseEther('3.1415')
    await sender.sendTransaction({
      to: recipient.address,
      value,
    })

    const gasPrice = await provider.getGasPrice()
    const toSendBack = value.sub(gasPrice.mul(21_000))
    await recipient.sendTransaction({
      to: sender.address,
      value: toSendBack,
      gasPrice,
      gasLimit: 21_000,
    })

    const balance = await provider.getBalance(recipient.address)
    expect(balance.eq(0)).to.equal(true)
  })

  it('throws for blockTag !== latest', async () => {
    const provider = await createTestProvider()
    const wallet = provider.walletManager.createEmptyWallet()

    await expect(
      provider.getBalance(wallet.address, 'pending'),
    ).to.be.rejectedWith('Unsupported blockTag')
  })
})
