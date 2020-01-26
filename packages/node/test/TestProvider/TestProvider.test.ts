import { expect } from 'chai'
import { utils, Wallet } from 'ethers'
import { CHAIN_NAME, CHAIN_ID } from '../../src/constants'
import { createTestProvider } from '../testutils'

describe('TestProvider', () => {
  it('sets the network correctly', async () => {
    const provider = await createTestProvider()
    expect(await provider.getNetwork()).to.deep.equal({
      name: CHAIN_NAME,
      chainId: CHAIN_ID,
    })
  })

  it('supports sending transactions', async () => {
    const provider = await createTestProvider()
    const [wallet] = provider.walletManager.getWallets()
    const other = Wallet.createRandom().connect(provider)

    await wallet.sendTransaction({
      to: other.address,
      value: utils.parseEther('10'),
    })

    expect(await wallet.getTransactionCount()).to.equal(1)

    const balance = await other.getBalance()
    expect(balance.eq(utils.parseEther('10'))).to.equal(true)
  })

  it('can get blocks', async () => {
    const provider = await createTestProvider()
    const [wallet, other] = provider.walletManager.getWallets()

    const blockZero = await provider.getBlock(0)
    expect(blockZero.number).to.equal(0)

    await wallet.sendTransaction({
      to: other.address,
      value: utils.parseEther('10'),
    })

    const blockOne = await provider.getBlock(1)
    expect(blockOne.transactions.length).to.equal(1)

    const blockOneByHash = await provider.getBlock(blockOne.hash)
    expect(blockOneByHash).to.deep.equal(blockOne)
  })
})
