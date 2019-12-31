import { request, expect } from 'chai'
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

  function makeRpcCall (methodName: string, params: any[]) {
    return request(app)
      .post('/')
      .send({ jsonrpc: '2.0', method: methodName, params: params, id: 1 })
  }

  it('supports net_version call', async () => {
    const res = await makeRpcCall('net_version', [])

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

    const res = await makeRpcCall('eth_getBalance', [recipient.address, 'latest'])

    expect(res).to.have.status(200)
    expect(res.body.result).to.be.eq(value.toHexString())
  })
})
