import { WalletManager } from '../../../src/test-chain/WalletManager'
import { expect } from 'chai'
import { makeAddress } from '../../../src/primitives'

describe('WalletManager.getWalletForAddress', () => {
  it('gets wallet if exist', () => {
    const walletManager = new WalletManager()

    walletManager.addFromPrivateKey('0x7045641ca116966a2bd5cd118bc001873ef025e5be60de68237e036fb5be1a58')

    const wallet = walletManager.getWalletForAddress(makeAddress('0x39753A8556C680b32088f487A1c6F02C8667db47'))

    expect(wallet).to.not.be.undefined
    expect(wallet).to.not.be.undefined
  })

  it('returns undefined if wallet doesn\'t exist', () => {
    const walletManager = new WalletManager()

    const wallet = walletManager.getWalletForAddress(makeAddress('0x39753A8556C680b32088f487A1c6F02C8667db47'))

    expect(wallet).to.be.undefined
  })
})
