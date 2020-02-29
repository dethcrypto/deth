import { expect } from 'chai'
import { getDefaultProvider } from 'ethers'
import { WalletManager } from '../../../src/services/WalletManager'

describe('WalletManager.createEmptyUntrackedWallet', () => {
  it('returns a connected wallet', async () => {
    const provider = getDefaultProvider()
    const walletManager = new WalletManager(undefined, provider)
    const wallet = walletManager.createEmptyUntrackedWallet()
    expect(wallet.provider).to.equal(provider)
  })

  it('returns a wallet with empty balance', async () => {
    const provider = getDefaultProvider()
    const walletManager = new WalletManager(undefined, provider)
    const wallet = walletManager.createEmptyUntrackedWallet()
    const balance = await wallet.getBalance()
    expect(balance.eq(0)).to.equal(true)
  })

  it('returns a unique wallet', async () => {
    const provider = getDefaultProvider()
    const walletManager = new WalletManager(undefined, provider)
    const first = walletManager.createEmptyUntrackedWallet()
    const second = walletManager.createEmptyUntrackedWallet()
    expect(first.address).not.to.equal(second.address)
  })

  it('returns a wallet not present in getWallets', async () => {
    const provider = getDefaultProvider()
    const walletManager = new WalletManager(undefined, provider)
    const wallet = walletManager.createEmptyUntrackedWallet()
    const other = walletManager.getWallets()

    const unique = other.every(x => x.address !== wallet.address)
    expect(unique).to.equal(true)
  })
})
