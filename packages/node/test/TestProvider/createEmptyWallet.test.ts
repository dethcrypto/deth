import { expect } from 'chai'
import { TestProvider } from '../../src/TestProvider'

describe('Testprovider.walletManager.createEmptyWallet', () => {
  it('returns a connected wallet', async () => {
    const provider = new TestProvider()
    const wallet = provider.walletManager.createEmptyWallet()
    expect(wallet.provider).to.equal(provider)
  })

  it('returns a wallet with empty balance', async () => {
    const provider = new TestProvider()
    const wallet = provider.walletManager.createEmptyWallet()
    const balance = await wallet.getBalance()
    expect(balance.eq(0)).to.equal(true)
  })

  it('returns a unique wallet', async () => {
    const provider = new TestProvider()
    const first = provider.walletManager.createEmptyWallet()
    const second = provider.walletManager.createEmptyWallet()
    expect(first.address).not.to.equal(second.address)
  })

  it('returns a wallet present in getWallets', async () => {
    const provider = new TestProvider()
    const wallet = provider.walletManager.createEmptyWallet()
    const other = provider.walletManager.getWallets()

    const unique = other.every(x => x.address !== wallet.address)
    expect(unique).to.equal(false)
  })
})
