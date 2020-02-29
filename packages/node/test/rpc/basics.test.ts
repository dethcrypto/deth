import { expect, request } from 'chai'

import { makeRpcCall } from '../common'
import { buildTestApp } from '../buildTestApp'
import { DEFAULT_CONFIG } from '../../src/config/config'

describe('rpc -> basics', () => {
  it('supports json envelope with ids as numbers', async () => {
    const app = await buildTestApp()
    const res = await request(app)
      .post('/')
      .send({ jsonrpc: '2.0', method: 'net_version', params: [], id: 1 })

    expect(res).to.have.status(200)
  })

  it('supports json envelope with ids as strings', async () => {
    const app = await buildTestApp()
    const res = await request(app)
      .post('/')
      .send({ jsonrpc: '2.0', method: 'net_version', params: [], id: '1' })

    expect(res).to.have.status(200)
  })

  it('supports net_version call', async () => {
    const app = await buildTestApp()
    const res = await makeRpcCall(app, 'net_version', [])

    expect(res).to.have.status(200)
    expect(res.body.result).to.be.eq(DEFAULT_CONFIG.blockchain.chainId.toString())
  })
})
