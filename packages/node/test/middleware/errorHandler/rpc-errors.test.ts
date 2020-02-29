import { request, expect } from 'chai'
import { makeRpcCall } from '../../common'
import { buildTestApp } from '../../buildTestApp'

describe('RPC/errors', () => {
  it('throws error on not existing method calls', async () => {
    const app = await buildTestApp()
    const res = await makeRpcCall(app, 'not_existing_method', [])

    expect(res).to.have.status(404)
    expect(res.body).to.be.deep.eq({
      jsonrpc: '2.0',
      error: {
        code: -32601,
        message: 'NotFound',
        details: ['RPC method: not_existing_method called with [] not found'],
      },
      id: 1,
    })
  })

  it('throws error on malformed envelope', async () => {
    const app = await buildTestApp()
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
