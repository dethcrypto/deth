import { expect } from 'chai'
import { utils, ContractFactory } from 'ethers'
import { TestProvider } from '../../src/TestProvider'
import { NETWORK_ID } from '../../src/constants'
import { COUNTER_ABI, COUNTER_BYTECODE } from '../contracts/Counter'

describe('getTransaction', () => {
  it('can return a mined transaction', async () => {
    const provider = new TestProvider()
    const [sender, recipient] = provider.getWallets()

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
      networkId: NETWORK_ID,
      wait: tx.wait,
    })
  })

  it('can return a contract creation', async () => {
    const provider = new TestProvider()
    const [wallet] = provider.getWallets()

    const factory = new ContractFactory(COUNTER_ABI, COUNTER_BYTECODE, wallet)
    const contract = await factory.deploy(0)

    const deployTransaction = contract.deployTransaction
    const tx = await provider.getTransaction(deployTransaction.hash!)

    expect(tx.to).to.equal(null)
    // For whatever reason ethers types lie about this!
    expect((tx as any).creates).to.equal(contract.address)
  })

  it('can return an old transaction', async () => {
    const provider = new TestProvider()
    const [sender, recipient] = provider.getWallets()

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

  xit('throws on nonexistent transaction')
})
