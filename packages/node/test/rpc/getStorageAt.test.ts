import { expect } from 'chai'

import { makeRpcCall, unwrapRpcResponse } from '../common'
import { buildTestApp } from '../buildTestApp'
import { numberToQuantity } from '@deth/chain'

describe('rpc -> getStorageAt', () => {
  it('works with not-existing data', async () => {
    const app = await buildTestApp()
    const emptyAcc = app.services.walletManager.createEmptyWallet()

    const response = unwrapRpcResponse(await makeRpcCall(app, 'eth_getStorageAt', [
      emptyAcc.address, numberToQuantity(0), 'latest',
    ]))
    // @todo: could be 0x0000000000000000000 as well... verify with geth/parity
    expect(response).to.be.eq('0x00')
  })
})
