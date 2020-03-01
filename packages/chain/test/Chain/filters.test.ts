import { Chain, numberToQuantity } from '../../src'
import { expect } from 'chai'

async function createChain (): Promise<Chain> {
  const chain = new Chain()
  await chain.init()

  return chain
}

describe('Chain -> filters', () => {
  it('creates filters', async () => {
    const chain = await createChain()

    const id = await chain.createNewBlockFilter()

    expect(id).to.be.eq(numberToQuantity(0))
  })

  it('gets empty changes from existing filters', async () => {
    const chain = await createChain()

    const id = await chain.createNewBlockFilter()

    expect(await chain.getFilterChanges(id)).to.be.deep.eq([])
  })

  it('gets changes from existing filters', async () => {
    const chain = await createChain()

    // this block shouldn't matter
    await chain.mineBlock()

    const id = await chain.createNewBlockFilter()

    await chain.mineBlock()

    const changes = await chain.getFilterChanges(id)

    expect(changes).to.have.length(1)
    expect(changes[0]).to.be.string
  })

  it('throws on not-existing filters', async () => {
    const chain = await createChain()

    const changesPromise = chain.getFilterChanges(numberToQuantity(1))

    expect(changesPromise).to.be.rejected
  })

  it('uninstalls existing filters', async () => {
    const chain = await createChain()

    const id = await chain.createNewBlockFilter()

    expect(await chain.uninstallFilter(id)).to.be.true
    // it should reject since this filter doesnt exist anymore
    expect(chain.getFilterChanges(id)).to.be.rejected
  })

  it('uninstalls not-existing filters', async () => {
    const chain = await createChain()

    expect(await chain.uninstallFilter(numberToQuantity(1))).to.be.false
  })
})
