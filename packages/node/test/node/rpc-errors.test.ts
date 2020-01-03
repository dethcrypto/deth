import { request, expect } from 'chai'
import { makeRpcCall } from './common'
import { getApp, NodeCtx } from '../../src/node/node'
import { TestChain } from '../../src'

describe('RPC/errors', () => {
  let app: Express.Application
  let ctx: NodeCtx
  beforeEach(() => {
    const chain = new TestChain()
    ctx = {
      chain,
    }

    app = getApp(ctx)
  })

  it('throws error on not existing method calls', async () => {
    const res = await makeRpcCall(app, 'not_existing_method', [])

    expect(res).to.have.status(404)
    expect(res.body).to.be.deep.eq({
      jsonrpc: '2.0',
      error: { code: -32601, message: 'NotFound' },
      id: 1,
    })
  })

  it('throws error on malformed envelope', async () => {
    const res = await request(app)
      .post('/')
      .send({ jsonrpc: '2.0', method: 'net_version', params: [] })

    expect(res).to.have.status(400)
    expect(res.body).to.be.deep.eq({
      jsonrpc: '2.0',
      error: {
        code: -32600,
        message: 'BadRequest',
        details: [
          'Invalid value undefined supplied to : { jsonrpc: "2.0", id: (number | string), method: string, params: any }/id: (number | string)/0: number',
          'Invalid value undefined supplied to : { jsonrpc: "2.0", id: (number | string), method: string, params: any }/id: (number | string)/1: string',
        ],
      },
      id: null,
    })
  })

  xit('throws error on malformed request')
})
