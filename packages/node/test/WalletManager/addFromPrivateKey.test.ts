import { WalletManager } from '../../src/WalletManager'
import { expect } from 'chai'
import { createTestProvider } from '../testutils'

describe('WalletManager.addFromPrivateKey', () => {
  it('adds not connected wallet', () => {
    const walletManager = new WalletManager()

    walletManager.addFromPrivateKey('0x7045641ca116966a2bd5cd118bc001873ef025e5be60de68237e036fb5be1a58')

    const allWallets = walletManager.getWallets()

    expect(allWallets).to.have.length(1)
    expect(allWallets[0].provider).to.be.undefined
  })

  it('doesn\'t add duplicates', () => {
    const walletManager = new WalletManager()

    walletManager.addFromPrivateKey('0x7045641ca116966a2bd5cd118bc001873ef025e5be60de68237e036fb5be1a58')
    walletManager.addFromPrivateKey('0x7045641ca116966a2bd5cd118bc001873ef025e5be60de68237e036fb5be1a58')

    const allWallets = walletManager.getWallets()

    expect(allWallets).to.have.length(1)
  })

  it('adds connected wallet', async () => {
    const provider = await createTestProvider()

    const walletManager = new WalletManager(undefined, provider)

    walletManager.addFromPrivateKey('0x7045641ca116966a2bd5cd118bc001873ef025e5be60de68237e036fb5be1a58')

    const allWallets = walletManager.getWallets()

    expect(allWallets).to.have.length(1)
    expect(allWallets[0].provider).to.be.eq(provider)
  })
})
