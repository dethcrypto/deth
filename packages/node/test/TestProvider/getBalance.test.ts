import { expect } from 'chai'
import { TestProvider } from '../../src/TestProvider'
import { utils } from 'ethers'

describe('TestProvider.getBalance', () => {
  it('can return a zero balance', async () => {
    const provider = new TestProvider()
    const wallet = provider.createEmptyWallet()

    const balance = await provider.getBalance(wallet.address)
    expect(balance.eq(0)).to.equal(true)
  })

  it('can return a non-zero balance', async () => {
    const provider = new TestProvider()
    const [sender] = provider.getWallets()
    const recipient = provider.createEmptyWallet()

    const value = utils.parseEther('3.1415')
    await sender.sendTransaction({
      to: recipient.address,
      value,
    })

    const balance = await provider.getBalance(recipient.address)
    expect(balance.eq(value)).to.equal(true)
  })

  it('can return a balance turned zero', async () => {
    const provider = new TestProvider()
    const [sender] = provider.getWallets()
    const recipient = provider.createEmptyWallet()

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

  xit('query by blockTag !== latest')
})
