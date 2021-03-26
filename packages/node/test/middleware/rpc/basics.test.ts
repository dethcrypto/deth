import { expect, request } from 'chai'

import { makeRpcCall } from './common'
import { buildTestApp } from '../../buildTestApp'
import { DEFAULT_CONFIG } from '../../../src/config/config'

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
    expect(res.body.result).to.be.eq(
      DEFAULT_CONFIG.blockchain.chainId.toString()
    )
  })

  it('supports json batched envelope', async () => {
    const app = await buildTestApp()

    const res = await request(app)
      .post('/')
      .send([
        { jsonrpc: '2.0', method: 'net_version', params: [], id: 1 },
        { jsonrpc: '2.0', method: 'eth_chainId', params: [], id: 2 },
      ])

    expect(res).to.have.status(200)
    expect(res.body).to.be.deep.eq([
      {
        id: 1,
        jsonrpc: '2.0',
        result: '1337',
      },
      {
        id: 2,
        jsonrpc: '2.0',
        result: '0x539',
      },
    ])
  })

  it('supports json batched envelope with a single request', async () => {
    const app = await buildTestApp()

    const res = await request(app)
      .post('/')
      .send([{ jsonrpc: '2.0', method: 'net_version', params: [], id: 1 }])

    expect(res).to.have.status(200)
    expect(res.body).to.be.deep.eq([
      {
        id: 1,
        jsonrpc: '2.0',
        result: '1337',
      },
    ])
  })

  it('supports json batched envelope with no requests', async () => {
    // should it throw an error?
    const app = await buildTestApp()

    const res = await request(app).post('/').send([])

    expect(res).to.have.status(200)
    expect(res.body).to.be.deep.eq([])
  })
})
