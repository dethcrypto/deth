import { WalletManager } from '../../../src/services/WalletManager'
import { expect } from 'chai'
import { getDefaultProvider } from 'ethers'

describe('WalletManager.addFromMnemonic', () => {
  it('adds not connected wallets from mnemonic', () => {
    const walletManager = new WalletManager()

    walletManager.addFromMnemonic('sunset setup guard source about taste volume clown method shield height butter')

    const allWallets = walletManager.getWallets()

    expect(allWallets).to.have.length(1)
    expect(allWallets[0].provider).to.be.undefined
  })

  it('doesn\'t add duplicates', () => {
    const walletManager = new WalletManager()

    walletManager.addFromMnemonic('sunset setup guard source about taste volume clown method shield height butter')
    walletManager.addFromMnemonic('sunset setup guard source about taste volume clown method shield height butter')

    const allWallets = walletManager.getWallets()

    expect(allWallets).to.have.length(1)
  })

  it('adds connected wallet from mnemonic', async () => {
    const provider = getDefaultProvider()

    const walletManager = new WalletManager(undefined, provider)

    walletManager.addFromMnemonic('sunset setup guard source about taste volume clown method shield height butter')

    const allWallets = walletManager.getWallets()

    expect(allWallets).to.have.length(1)
    expect(allWallets[0].provider).to.be.eq(provider)
  })
})
