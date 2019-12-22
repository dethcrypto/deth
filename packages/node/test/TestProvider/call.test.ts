import { expect } from 'chai'
import { ContractFactory } from 'ethers'
import { TestProvider } from '../../src/TestProvider'
import { COUNTER_ABI, COUNTER_BYTECODE } from '../contracts/Counter'

describe('TestProvider.call', () => {
  xit('can call a simple transfer')
  xit('can call a contract deploy')

  it('can call a contract method', async () => {
    const provider = new TestProvider()
    const [wallet] = provider.getWallets()

    const factory = new ContractFactory(COUNTER_ABI, COUNTER_BYTECODE, wallet)
    const contract = await factory.deploy(0)

    const value = await provider.call({
      from: wallet.address,
      to: contract.address,
      data: contract.interface.functions.value.encode([]),
      gasLimit: 50_000
    })
    expect(value).to.equal('0x' + '00'.repeat(32))
  })

  xit('handles execution errors')
})
