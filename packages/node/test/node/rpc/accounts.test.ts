import { expect } from 'chai'

import { makeRpcCall, runRpcHarness, unwrapRpcResponse } from '../common'

describe('rpc -> eth_accounts', () => {
  let app: Express.Application
  beforeEach(async () => {
    ({ app } = await runRpcHarness())
  })

  it('supports eth_accounts', async () => {
    const accounts = unwrapRpcResponse(await makeRpcCall(app, 'eth_accounts'))

    expect(accounts.length).to.be.eq(10)
    expect(accounts[0]).to.be.eq('0x39753a8556c680b32088f487a1c6f02c8667db47')
  })
})
