import { expect } from 'chai'
import { createTestProvider } from '../testutils'

describe('TestProvider.getBlockNumber', () => {
  it('starts with block number 0', async () => {
    const provider = await createTestProvider()
    expect(await provider.getBlockNumber()).to.equal(0)
  })

  it('reflects how many blocks were mined', async () => {
    const provider = await createTestProvider()
    await provider.mineBlock()
    expect(await provider.getBlockNumber()).to.equal(1)
    await provider.mineBlock()
    expect(await provider.getBlockNumber()).to.equal(2)
  })
})
