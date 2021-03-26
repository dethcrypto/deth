import { expect } from 'chai'
import { utils, ContractFactory, providers } from 'ethers'
import { COUNTER_ABI, COUNTER_BYTECODE } from '../contracts/Counter'
import { createTestProvider } from './TestProvider'

describe('TestProvider.sendTransaction', () => {
  it('can send a simple transfer', async () => {
    const provider = await createTestProvider()
    const [sender, recipient] = provider.getWallets()

    const response = await sender.sendTransaction({
      to: recipient.address,
      value: utils.parseEther('3.1415'),
    })

    expect(response).not.to.equal(undefined)
  })

  it('can deploy a contract', async () => {
    const provider = await createTestProvider()
    const [wallet] = provider.getWallets()

    const factory = new ContractFactory(COUNTER_ABI, COUNTER_BYTECODE, wallet)
    const tx = factory.getDeployTransaction(0)

    const response = await wallet.sendTransaction(tx)
    const receipt = await response.wait()

    expect(receipt.contractAddress).not.to.equal(undefined)
  })

  it('can call a contract method', async () => {
    const provider = await createTestProvider()
    const [wallet] = provider.getWallets()

    const factory = new ContractFactory(COUNTER_ABI, COUNTER_BYTECODE, wallet)
    const contract = await factory.deploy(0)

    const response: providers.TransactionResponse = await contract.increment(1)
    const receipt = await response.wait()
    const value = await contract.value()

    expect(response).not.to.equal(undefined)
    expect(receipt.status).to.equal(1)
    expect(value.toNumber()).to.equal(1)
  })

  it('can call a contract method that reverts', async () => {
    const provider = await createTestProvider()
    const [wallet] = provider.getWallets()

    const factory = new ContractFactory(COUNTER_ABI, COUNTER_BYTECODE, wallet)
    const contract = await factory.deploy(0)

    const response: providers.TransactionResponse = await contract.incrementAndRevert(
      1
    )
    const receipt = await provider.getTransactionReceipt(response.hash!) // note: potential race
    const value = await contract.value()

    expect(response).not.to.equal(undefined)
    expect(receipt.status).to.equal(0)
    expect(value.toNumber()).to.equal(0)
  })
})
