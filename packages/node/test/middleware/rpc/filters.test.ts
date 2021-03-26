import { expect } from 'chai'

import { makeRpcCall, unwrapRpcResponse } from './common'
import { buildTestApp } from '../../buildTestApp'

describe('rpc -> filters', () => {
  it('creates block filters', async () => {
    const app = await buildTestApp()

    const filterId = unwrapRpcResponse(
      await makeRpcCall(app, 'eth_newBlockFilter', [])
    )

    expect(filterId).to.be.string

    await app.services.chain.mineBlock()

    const changes = unwrapRpcResponse(
      await makeRpcCall(app, 'eth_getFilterChanges', [filterId])
    )

    expect(changes).to.have.length(2)
  })
})
