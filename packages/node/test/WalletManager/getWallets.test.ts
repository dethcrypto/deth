import { expect } from 'chai'
import { WalletManager } from '../../src/WalletManager'
import { getDefaultProvider } from 'ethers'
import { DEFAULT_NODE_CONFIG } from '../../src/config/config'

const privateKeys = DEFAULT_NODE_CONFIG.blockchain.accounts.privateKeys

describe('WalletManager.getWallets', () => {
  it('returns ten wallets', async () => {
    const walletManager = new WalletManager(privateKeys)
    const wallets = walletManager.getWallets()

    expect(wallets.length).to.equal(10)
  })

  it('all wallets are connected to the provider', async () => {
    const provider = getDefaultProvider()
    const walletManager = new WalletManager(privateKeys, provider)
    const wallets = walletManager.getWallets()

    for (const wallet of wallets) {
      expect(wallet.provider).to.equal(provider)
    }
  })
})
