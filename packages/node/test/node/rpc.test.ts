import { expect } from 'chai'
import { makeRpcCall } from './common'
import { getApp, NodeCtx } from '../../src/node/node'
import { TestChain, TestProvider } from '../../src'
import { CHAIN_ID } from '../../src/constants'
import { utils } from 'ethers'

describe('RPC', () => {
  let app: Express.Application
  let ctx: NodeCtx
  beforeEach(() => {
    const chain = new TestChain()
    ctx = {
      chain,
    }

    app = getApp(ctx)
  })

  it('supports net_version call', async () => {
    const res = await makeRpcCall(app, 'net_version', [])

    expect(res).to.have.status(200)
    expect(res.body.result).to.be.eq(CHAIN_ID.toString())
  })

  it('supports eth_getBalance call for account with non-zero balance', async () => {
    // this test could use other RPC call for sending tx but they are not implemented yet
    const provider = new TestProvider(ctx.chain)
    const [sender] = provider.getWallets()
    const recipient = provider.createEmptyWallet()

    const value = utils.parseEther('3.1415')
    await sender.sendTransaction({
      to: recipient.address,
      value,
    })

    const res = await makeRpcCall(app, 'eth_getBalance', [
      recipient.address,
      'latest',
    ])

    expect(res).to.have.status(200)
    expect(res.body.result).to.be.eq(value.toHexString())
  })
})
