import { expect } from 'chai'
import { utils } from 'ethers'
import { createTestProvider } from '../../testutils'

describe('TestProvider.getGasPrice', () => {
  it('defaults to one gwei', async () => {
    const provider = await createTestProvider()
    const gasPrice = await provider.getGasPrice()
    expect(gasPrice.toNumber()).to.equal(1_000_000_000)
  })

  it('can be overwritten', async () => {
    const provider = await createTestProvider({ defaultGasPrice: utils.bigNumberify(1_000) })
    const gasPrice = await provider.getGasPrice()
    expect(gasPrice.toNumber()).to.equal(1_000)
  })
})
