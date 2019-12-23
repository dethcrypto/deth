import { expect } from 'chai'
import { ContractFactory, utils } from 'ethers'
import { TestProvider } from '../../src/TestProvider'
import { COUNTER_ABI, COUNTER_BYTECODE } from '../contracts/Counter'

describe('TestProvider.call', () => {
  xit('can call a simple transfer')
  xit('can call a contract deploy')

  it('can call a contract method directly', async () => {
    const provider = new TestProvider()
    const [wallet] = provider.getWallets()

    const factory = new ContractFactory(COUNTER_ABI, COUNTER_BYTECODE, wallet)
    const contract = await factory.deploy(0)

    const value = await provider.call({
      from: wallet.address,
      to: contract.address,
      data: contract.interface.functions.value.encode([]),
      gasLimit: 50_000,
    })
    expect(value).to.equal('0x' + '00'.repeat(32))
  })

  it('can call a contract method indirectly', async () => {
    const provider = new TestProvider()
    const [wallet] = provider.getWallets()

    const factory = new ContractFactory(COUNTER_ABI, COUNTER_BYTECODE, wallet)
    const contract = await factory.deploy(42)

    await contract.increment(378)

    const value: utils.BigNumber = await contract.value()
    expect(value.eq(420)).to.equal(true)
  })

  xit('handles execution errors')

  it('throws for blockTag !== latest', async () => {
    const provider = new TestProvider()

    await expect(
      provider.call({}, 'pending'),
    ).to.be.rejectedWith('Unsupported blockTag')
  })
})
