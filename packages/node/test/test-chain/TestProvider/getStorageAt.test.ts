import { expect } from 'chai'
import { ContractFactory, providers } from 'ethers'
import { COUNTER_ABI, COUNTER_BYTECODE } from '../../contracts/Counter'
import { createTestProvider } from '../../testutils'

describe('TestProvider.getStorageAt', () => {
  it('works with existing data', async () => {
    const provider = await createTestProvider()
    const [wallet] = provider.walletManager.getWallets()

    const factory = new ContractFactory(COUNTER_ABI, COUNTER_BYTECODE, wallet)
    const contract = await factory.deploy(0)

    const response: providers.TransactionResponse = await contract.increment(1)
    await response.wait()

    const counterValue = await provider.getStorageAt(contract.address, 0)
    expect(counterValue).to.equal('0x01')
  })

  it('works with not-existing data', async () => {
    const provider = await createTestProvider()
    const [wallet] = provider.walletManager.getWallets()

    const factory = new ContractFactory(COUNTER_ABI, COUNTER_BYTECODE, wallet)
    const contract = await factory.deploy(0)

    const notExistingValue = await provider.getStorageAt(contract.address, 1)
    // @TODO: should be 0x00? this needs verification against geth or parity
    expect(notExistingValue).to.equal('0x')
  })
})
