import { expect } from 'chai'
import { TestProvider } from '../../src/TestProvider'
import { utils } from 'ethers'

describe('Testprovider.walletManager.getWallets', () => {
  it('returns ten wallets', async () => {
    const provider = new TestProvider()
    const wallets = provider.walletManager.getWallets()

    expect(wallets.length).to.equal(10)
  })

  it('all wallets are connected to the provider', async () => {
    const provider = new TestProvider()
    const wallets = provider.walletManager.getWallets()

    for (const wallet of wallets) {
      expect(wallet.provider).to.equal(provider)
    }
  })

  it('every wallet has an initial balance of 100 ETH', async () => {
    const provider = new TestProvider()
    const wallets = provider.walletManager.getWallets()

    for (const wallet of wallets) {
      const balance = await provider.getBalance(wallet.address)
      expect(balance.eq(utils.parseEther('100'))).to.equal(true)
    }
  })

  it('the initial balance can be customized', async () => {
    const initialBalance = utils.parseEther('42.69')
    const provider = new TestProvider({ initialBalance })
    const wallets = provider.walletManager.getWallets()

    for (const wallet of wallets) {
      const balance = await provider.getBalance(wallet.address)
      expect(balance.eq(initialBalance)).to.equal(true)
    }
  })

  it('every wallet has an initial transaction count of 0', async () => {
    const provider = new TestProvider()
    const wallets = provider.walletManager.getWallets()

    for (const wallet of wallets) {
      const txCount = await provider.getTransactionCount(wallet.address)
      expect(txCount).to.equal(0)
    }
  })
})
