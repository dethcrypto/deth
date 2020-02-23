import { expect } from 'chai'
import { utils, ContractFactory } from 'ethers'
import { COUNTER_ABI, COUNTER_BYTECODE } from '../contracts/Counter'
import { randomHash, createTestProvider } from '../testutils'
import { DEFAULT_NODE_CONFIG } from '../../src/config/config'

describe('TestProvider.getTransaction', () => {
  it('can return a mined transaction', async () => {
    const provider = await createTestProvider()
    const [sender, recipient] = provider.walletManager.getWallets()

    const value = utils.parseEther('3.1415')
    const response = await sender.sendTransaction({
      to: recipient.address,
      value,
    })

    const tx = await provider.getTransaction(response.hash!)
    const block = await provider.getBlock('latest')

    expect(utils.keccak256(tx.raw!)).to.equal(tx.hash)
    expect(tx).to.deep.equal({
      hash: response.hash,
      blockHash: block.hash,
      blockNumber: block.number,
      transactionIndex: 0,
      confirmations: 1,
      from: sender.address,
      gasPrice: response.gasPrice,
      gasLimit: response.gasLimit,
      to: recipient.address,
      value,
      nonce: 0,
      data: '0x',
      r: response.r,
      s: response.s,
      v: response.v,
      raw: tx.raw,
      creates: null,
      networkId: DEFAULT_NODE_CONFIG.blockchain.chainId,
      wait: tx.wait,
    })
  })

  it('can return a contract creation', async () => {
    const provider = await createTestProvider()
    const [wallet] = provider.walletManager.getWallets()

    const factory = new ContractFactory(COUNTER_ABI, COUNTER_BYTECODE, wallet)
    const contract = await factory.deploy(0)

    const deployTransaction = contract.deployTransaction
    const tx = await provider.getTransaction(deployTransaction.hash!)

    expect(tx.to).to.equal(null)
    // For whatever reason ethers types lie about this!
    expect((tx as any).creates).to.equal(contract.address)
  })

  it('can return an old transaction', async () => {
    const provider = await createTestProvider()
    const [sender, recipient] = provider.walletManager.getWallets()

    const value = utils.parseEther('3.1415')
    const response = await sender.sendTransaction({
      to: recipient.address,
      value,
    })

    const block = await provider.getBlock('latest')
    await provider.mineBlock()
    await provider.mineBlock()

    const tx = await provider.getTransaction(response.hash!)

    expect(tx.confirmations).to.equal(3)
    expect(tx.blockHash).to.equal(block.hash)
  })

  it('throws on nonexistent transaction', async () => {
    const provider = await createTestProvider()
    const hash = randomHash()

    await expect(
      provider.getTransaction(hash),
    ).to.be.rejectedWith('not found')
  })
})
