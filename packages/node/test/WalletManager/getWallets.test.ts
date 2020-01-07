import { expect } from 'chai'
import { utils } from 'ethers'
import { getOptionsWithDefaults } from '../../src/TestChainOptions'
import { WalletManager } from '../../src/WalletManager'
import { TestProvider } from '../../src'

const { privateKeys } = getOptionsWithDefaults()

describe('WalletManager.getWallets', () => {
  it('returns ten wallets', async () => {
    const walletManager = new WalletManager(privateKeys)
    const wallets = walletManager.getWallets()

    expect(wallets.length).to.equal(10)
  })

  it('all wallets are connected to the provider', async () => {
    const provider = new TestProvider()
    const walletManager = new WalletManager(privateKeys, provider)
    const wallets = walletManager.getWallets()

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
