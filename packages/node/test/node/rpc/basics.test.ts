import { expect, request } from 'chai'
import { makeRpcCall } from '../common'
import { getApp } from '../../../src/node/node'
import { TestChain } from '../../../src'
import { NodeCtx } from '../../../src/node/ctx'
import { WalletManager } from '../../../src/WalletManager'
import { getOptionsWithDefaults, DEFAULTS } from '../../../src/TestChainOptions'

describe('rpc -> basics', () => {
  let app: Express.Application
  let ctx: NodeCtx
  beforeEach(async () => {
    const chain = new TestChain()
    await chain.init()
    const options = getOptionsWithDefaults()
    ctx = {
      chain,
      walletManager: new WalletManager(chain.options.privateKeys),
      options,
    }

    app = getApp(ctx)
  })

  it('supports json envelope with ids as numbers', async () => {
    const res = await request(app)
      .post('/')
      .send({ jsonrpc: '2.0', method: 'net_version', params: [], id: 1 })

    expect(res).to.have.status(200)
  })

  it('supports json envelope with ids as strings', async () => {
    const res = await request(app)
      .post('/')
      .send({ jsonrpc: '2.0', method: 'net_version', params: [], id: '1' })

    expect(res).to.have.status(200)
  })

  it('supports net_version call', async () => {
    const res = await makeRpcCall(app, 'net_version', [])

    expect(res).to.have.status(200)
    expect(res.body.result).to.be.eq(DEFAULTS.chainId.toString())
  })
})
