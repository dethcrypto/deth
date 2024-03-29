import { expect } from 'chai'
import { ContractFactory } from 'ethers'
import {
  COUNTER_ABI,
  COUNTER_BYTECODE,
  COUNTER_RUNTIME,
} from '../contracts/Counter'
import { createTestProvider } from './TestProvider'

describe('TestProvider.getCode', () => {
  it('returns empty value for normal addresses', async () => {
    const provider = await createTestProvider()
    const wallet = provider.createEmptyWallet()

    const code = await provider.getCode(wallet.address)
    expect(code).to.equal('0x')
  })

  it('returns runtime bytecode for contracts', async () => {
    const provider = await createTestProvider()
    const [wallet] = provider.getWallets()

    const factory = new ContractFactory(COUNTER_ABI, COUNTER_BYTECODE, wallet)
    const contract = await factory.deploy(0)

    const code = await provider.getCode(contract.address)
    expect(code).to.equal(COUNTER_RUNTIME)
  })

  it('throws for blockTag !== latest', async () => {
    const provider = await createTestProvider()
    const wallet = provider.createEmptyWallet()

    await expect(
      provider.getCode(wallet.address, 'pending')
    ).to.be.rejectedWith('Unsupported blockTag')
  })
})
