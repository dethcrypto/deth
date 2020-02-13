import { expect } from 'chai'

import { NodeCtx } from '../../../src/node/ctx'
import { makeRpcCall, runRpcHarness, unwrapRpcResponse } from '../common'
import { numberToQuantity } from '../../../src/primitives'

describe('rpc -> getStorageAt', () => {
  let app: Express.Application
  let ctx: NodeCtx
  beforeEach(async () => {
    ({ app, ctx } = await runRpcHarness())
  })

  it('works with not-existing data', async () => {
    const emptyAcc = ctx.walletManager.createEmptyWallet()

    const response = unwrapRpcResponse(await makeRpcCall(app, 'eth_getStorageAt', [
      emptyAcc.address, numberToQuantity(0), 'latest',
    ]))
    // @todo: could be 0x0000000000000000000 as well... verify with geth/parity
    expect(response).to.be.eq('0x00')
  })
})
