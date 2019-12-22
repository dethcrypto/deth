import { expect } from 'chai'
import { TestProvider } from '../../src/TestProvider'
import { utils, ContractFactory } from 'ethers'
import { COUNTER_ABI, COUNTER_BYTECODE } from '../contracts/Counter'

describe('TestProvider.sendTransaction', () => {
  it('can send a simple transfer', async () => {
    const provider = new TestProvider()
    const [sender, recipient] = provider.getWallets()

    const response = await sender.sendTransaction({
      to: recipient.address,
      value: utils.parseEther('3.1415'),
    })

    expect(response).not.to.equal(undefined)
  })

  it('can deploy a contract', async () => {
    const provider = new TestProvider()
    const [wallet] = provider.getWallets()

    const factory = new ContractFactory(COUNTER_ABI, COUNTER_BYTECODE, wallet)
    const tx = factory.getDeployTransaction(0)

    const response = await wallet.sendTransaction(tx)
    const receipt = await response.wait()

    expect(receipt.contractAddress).not.to.equal(undefined)
  })

  it('can call a contract method', async () => {
    const provider = new TestProvider()
    const [wallet] = provider.getWallets()

    const factory = new ContractFactory(COUNTER_ABI, COUNTER_BYTECODE, wallet)
    const contract = await factory.deploy(0)

    const response = await contract.increment(1)
    const receipt = await response.wait()

    expect(response).not.to.equal(undefined)
  })
})
