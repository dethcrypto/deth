import { Wallet, providers } from 'ethers'
import { Address, makeAddress } from './model'
import debug from 'debug'
const d = debug('deth:WalletManager')

/**
 * Manager for EthersJS Wallets
 * Ethersjs wallets can be connect to a provider, then convenience functions like getBalance work
 * This will auto connect wallets to a provider if it was specified in a constructor
 */
export class WalletManager {
  protected readonly wallets: Map<Address, Wallet> = new Map()

  constructor (privateKeys?: ReadonlyArray<string>, readonly defaultProvider?: providers.Provider) {
    if (privateKeys) {
      privateKeys.forEach(pk => this.addFromPrivateKey(pk))
    }
  }

  addFromPrivateKey (privateKey: string): void {
    const wallet = new Wallet(privateKey)
    this.addWallet(wallet)
  }

  addFromMnemonic (mnemonic: string, dp?: string) {
    const wallet = Wallet.fromMnemonic(mnemonic, dp)
    this.addWallet(wallet)
  }

  addWallet (wallet: Wallet): Wallet {
    const address = makeAddress(wallet.address)
    if (this.wallets.has(address)) {
      d(`${address} already added... skipping`)
    }

    const finalWallet = this.defaultProvider ? wallet.connect(this.defaultProvider) : wallet
    this.wallets.set(address, finalWallet)

    return finalWallet
  }

  getWalletForAddress (address: Address): Wallet | undefined {
    return this.wallets.get(address)
  }

  createEmptyWallet () {
    const wallet = Wallet.createRandom()
    return this.addWallet(wallet)
  }

  /**
   * Do not track this wallet in wallets map so it won't be possible find it's private key (sign any message)
   */
  createEmptyUntrackedWallet () {
    const wallet = Wallet.createRandom()
    return this.defaultProvider ? wallet.connect(this.defaultProvider) : wallet
  }

  getWallets (): Wallet[] {
    return Array.from(this.wallets.values())
  }
}
