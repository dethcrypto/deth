import { expect, request } from 'chai'

import { makeRpcCall, runRpcHarness } from '../common'
import { DEFAULT_NODE_CONFIG } from '../../src/config/config'

describe('rpc -> basics', () => {
  let app: Express.Application
  beforeEach(async () => {
    ({ app } = await runRpcHarness())
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
    expect(res.body.result).to.be.eq(DEFAULT_NODE_CONFIG.blockchain.chainId.toString())
  })
})
