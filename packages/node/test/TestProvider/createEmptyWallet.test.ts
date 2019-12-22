import { expect } from 'chai'
import { TestProvider } from '../../src/TestProvider'

describe('TestProvider.createEmptyWallet', () => {
  it('returns a connected wallet', async () => {
    const provider = new TestProvider()
    const wallet = provider.createEmptyWallet()
    expect(wallet.provider).to.equal(provider)
  })

  it('returns a wallet with empty balance', async () => {
    const provider = new TestProvider()
    const wallet = provider.createEmptyWallet()
    const balance = await wallet.getBalance()
    expect(balance.eq(0)).to.equal(true)
  })

  it('returns a unique wallet', async () => {
    const provider = new TestProvider()
    const first = provider.createEmptyWallet()
    const second = provider.createEmptyWallet()
    expect(first.address).not.to.equal(second.address)
  })

  it('returns a wallet not present in getWallets', async () => {
    const provider = new TestProvider()
    const wallet = provider.createEmptyWallet()
    const other = provider.getWallets()

    const unique = other.every(x => x.address !== wallet.address)
    expect(unique).to.equal(true)
  })
})
