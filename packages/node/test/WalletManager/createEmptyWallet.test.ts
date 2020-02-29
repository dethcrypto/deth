import { expect } from 'chai'
import { getDefaultProvider } from 'ethers'
import { WalletManager } from '../../src/WalletManager'

describe('WalletManager.createEmptyWallet', () => {
  it('returns a connected wallet', async () => {
    const provider = getDefaultProvider()
    const walletManager = new WalletManager(undefined, provider)
    const wallet = walletManager.createEmptyWallet()
    expect(wallet.provider).to.equal(provider)
  })

  it('returns a wallet with empty balance', async () => {
    const provider = getDefaultProvider()
    const walletManager = new WalletManager(undefined, provider)
    const wallet = walletManager.createEmptyWallet()
    const balance = await wallet.getBalance()
    expect(balance.eq(0)).to.equal(true)
  })

  it('returns a unique wallet', async () => {
    const provider = getDefaultProvider()
    const walletManager = new WalletManager(undefined, provider)
    const first = walletManager.createEmptyWallet()
    const second = walletManager.createEmptyWallet()
    expect(first.address).not.to.equal(second.address)
  })

  it('returns a wallet present in getWallets', async () => {
    const provider = getDefaultProvider()
    const walletManager = new WalletManager(undefined, provider)
    const wallet = walletManager.createEmptyWallet()
    const other = walletManager.getWallets()

    const unique = other.every(x => x.address !== wallet.address)
    expect(unique).to.equal(false)
  })
})
