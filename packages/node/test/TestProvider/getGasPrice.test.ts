import { expect } from 'chai'
import { TestProvider } from '../../src/TestProvider'
import { utils } from 'ethers'

describe('TestProvider.getGasPrice', () => {
  it('defaults to one gwei', async () => {
    const provider = new TestProvider()
    const gasPrice = await provider.getGasPrice()
    expect(gasPrice.toNumber()).to.equal(1_000_000_000)
  })

  it('can be overwritten', async () => {
    const provider = new TestProvider({ defaultGasPrice: utils.bigNumberify(1_000) })
    const gasPrice = await provider.getGasPrice()
    expect(gasPrice.toNumber()).to.equal(1_000)
  })
})
